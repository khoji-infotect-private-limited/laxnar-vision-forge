// edge-validate-and-submit.ts
import "https://deno.land/x/xhr@0.1.0/mod.ts"; // keep if you rely on polyfill in some envs
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";
import { createHash } from "https://deno.land/std@0.168.0/node/crypto.ts";

/**
 * Edge Function: validate-and-submit
 * - Validates CIN using Cashfree Verification API (public-key signature)
 * - Stores submission in Supabase
 * - Sends Facebook Conversions API event (server-side)
 *
 * Logging: verbose debug logs included to help diagnose "Signature mismatch" issues.
 * Remove or reduce logs after confirming with Cashfree.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function normalizeName(s?: string) {
  if (!s) return "";
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

// Convert PEM public key to ArrayBuffer (DER) for import
function pemToArrayBuffer(pem: string) {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

// RSA-OAEP encrypt and base64 encode (returns base64 signature)
// NOTE: Cashfree uses RSA-OAEP with SHA-1 (OpenSSL default), not SHA-256
async function rsaEncryptBase64Oaep(pemPublicKey: string, message: string) {
  const der = pemToArrayBuffer(pemPublicKey);
  const cryptoKey = await crypto.subtle.importKey("spki", der, { name: "RSA-OAEP", hash: "SHA-1" }, false, [
    "encrypt",
  ]);
  const encoded = new TextEncoder().encode(message);
  const encrypted = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, cryptoKey, encoded);
  const u8 = new Uint8Array(encrypted);
  // base64 encode
  let binary = "";
  for (let i = 0; i < u8.byteLength; i++) binary += String.fromCharCode(u8[i]);
  return btoa(binary);
}

// main server
serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // parse body
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    console.error("Invalid JSON body:", e.message);
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { companyName, cin, founderName, founderBackground, idea, revenueModel, usp, email, phone } = body || {};

  // Basic required fields check
  if (!companyName || !cin || !founderName || !idea || !revenueModel || !usp || !email) {
    console.warn("Missing required fields", {
      companyNamePresent: !!companyName,
      cinPresent: !!cin,
      founderNamePresent: !!founderName,
      emailPresent: !!email,
    });
    return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // normalize and validate CIN format (basic)
  const cinNormalized = String(cin).toUpperCase().trim();
  if (!/^[A-Z0-9]{21}$/.test(cinNormalized)) {
    console.warn("Invalid CIN format", { cin });
    return new Response(JSON.stringify({ ok: false, error: "Invalid CIN format" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Load env
  const clientId = Deno.env.get("CASHFREE_CLIENT_ID");
  const clientSecret = Deno.env.get("CASHFREE_CLIENT_SECRET");
  const pemPublic = Deno.env.get("CASHFREE_PUBLIC_KEY_PEM") || "";
  const useSignatureEnv = (Deno.env.get("CASHFREE_USE_SIGNATURE") ?? "true").toLowerCase();
  const useSignature = useSignatureEnv === "true" || useSignatureEnv === "1";

  if (!clientId || !clientSecret) {
    console.error("Missing Cashfree clientId/secret in environment");
    return new Response(JSON.stringify({ ok: false, error: "Server configuration error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Build Cashfree request
  const cashfreeUrl = "https://api.cashfree.com/verification/cin";
  const verificationId = `LAXNAR-${Date.now()}`;

  // Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-client-id": clientId,
    "x-client-secret": clientSecret,
  };

  let debugSignatureInfo: { dataToSign?: string; timestamp?: string; signature?: string } = {};

  try {
    if (useSignature) {
      if (!pemPublic) {
        console.error("CASHFREE_USE_SIGNATURE true but CASHFREE_PUBLIC_KEY_PEM missing");
        return new Response(JSON.stringify({ ok: false, error: "Server configuration error (public key missing)" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // IMPORTANT: timestamp in seconds
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const dataToSign = `${clientId}.${timestamp}`;

      // Generate signature using RSA-OAEP (SHA-256)
      const signature = await rsaEncryptBase64Oaep(pemPublic, dataToSign);

      // Attach signature headers
      headers["x-cf-timestamp"] = timestamp;
      headers["x-cf-signature"] = signature;

      // Save debug info (do NOT log secrets like clientSecret)
      debugSignatureInfo = { dataToSign, timestamp, signature };
      console.info("Generated Cashfree signature", { dataToSign, timestamp, signature });
    } else {
      console.info("CASHFREE_USE_SIGNATURE is false — calling Cashfree without x-cf-signature (IP-whitelist mode).");
    }
  } catch (err) {
    console.error("Error generating Cashfree signature:", err);
    return new Response(JSON.stringify({ ok: false, error: "Failed to generate Cashfree signature" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Call Cashfree
  let verificationData: any = null;
  try {
    const payload = { verification_id: verificationId, cin: cinNormalized };
    console.info("Calling Cashfree verification API", { url: cashfreeUrl, verificationId, cin: cinNormalized });

    const cfResp = await fetch(cashfreeUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const respText = await cfResp.text();
    let parsed: any = null;
    try {
      parsed = JSON.parse(respText);
    } catch (e) {
      console.error("Cashfree response not JSON", { status: cfResp.status, textSnippet: respText.slice(0, 200) });
      return new Response(JSON.stringify({ ok: false, error: "Verification service error (non-JSON response)" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.info("Cashfree HTTP status", cfResp.status);
    console.debug("Cashfree response body", parsed);

    if (!cfResp.ok) {
      // Helpful debug info to copy to Cashfree support (do NOT include clientSecret)
      console.error("Cashfree API error (non-OK)", { status: cfResp.status, body: parsed, debugSignatureInfo });
      const providerMessage = parsed?.message || parsed?.error || JSON.stringify(parsed);
      return new Response(JSON.stringify({ ok: false, accepted: false, error: providerMessage }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    verificationData = parsed;
  } catch (err) {
    console.error("Error calling Cashfree API:", err);
    return new Response(JSON.stringify({ ok: false, error: "Verification service unavailable. Please try later." }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Inspect verificationData fields (adapt if Cashfree uses different keys)
  const companyStatus = verificationData.cin_status || verificationData.company_status || verificationData.status || "";
  const companyType = verificationData.company_type || verificationData.type || verificationData.company_class || "";
  const verifiedCompanyName = verificationData.company_name || verificationData.name || "";
  
  // Extract company type from company name if not provided
  const inferredCompanyType = verifiedCompanyName.toLowerCase().includes("private") ? "private" : companyType;

  console.info("Verification result summary", { companyStatus, companyType, verifiedCompanyName });

  // Validate status & type
  if (!companyStatus || String(companyStatus).toLowerCase() !== "active") {
    console.warn("Company not active", { companyStatus });
    return new Response(
      JSON.stringify({
        ok: false,
        accepted: false,
        error:
          "We only accept Active Private Limited companies. If you think this is an error, contact hello@laxnar.ai.",
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  if (!inferredCompanyType || !String(inferredCompanyType).toLowerCase().includes("private")) {
    console.warn("Company not private limited", { companyType, inferredCompanyType });
    return new Response(
      JSON.stringify({
        ok: false,
        accepted: false,
        error:
          "We only accept Active Private Limited companies. If you think this is an error, contact hello@laxnar.ai.",
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Basic name fuzzy match
  const submittedNorm = normalizeName(companyName);
  const verifiedNorm = normalizeName(verifiedCompanyName);
  if (submittedNorm && verifiedNorm) {
    const minLen = Math.min(8, Math.max(4, Math.floor(verifiedNorm.length / 2)));
    const match =
      submittedNorm.includes(verifiedNorm.substring(0, minLen)) ||
      verifiedNorm.includes(submittedNorm.substring(0, minLen));
    if (!match) {
      console.warn("Name mismatch", { submittedNorm, verifiedNorm });
      return new Response(
        JSON.stringify({
          ok: false,
          accepted: false,
          error: "Company name does not match CIN record — please confirm.",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  }

  // Persist to Supabase
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase env vars");
    return new Response(JSON.stringify({ ok: false, error: "Server configuration error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const insertPayload = {
      company_name: companyName,
      cin: cinNormalized,
      founder_name: founderName,
      founder_background: founderBackground,
      idea,
      revenue_model: revenueModel,
      usp,
      email,
      phone: phone || null,
      company_status: companyStatus,
      verified_company_name: verifiedCompanyName,
      verification_raw: verificationData,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("submissions").insert([insertPayload]);

    if (error) {
      console.error("Supabase insert error", error);
      return new Response(JSON.stringify({ ok: false, error: "Failed to save submission" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.info("Saved submission to Supabase", {
      company: companyName,
      cin: cinNormalized,
      id: data?.[0]?.id ?? null,
    });
  } catch (err) {
    console.error("Error saving to Supabase", err);
    return new Response(JSON.stringify({ ok: false, error: "Database error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Fire Facebook Conversions API (server-side) - hashed PII
  const fbPixelId = Deno.env.get("FB_PIXEL_ID") ?? "864907882634894";
  const fbAccessToken = Deno.env.get("FB_CONVERSION_API_TOKEN");

  if (fbAccessToken) {
    try {
      const hashedEmail = sha256Hex(String(email).trim().toLowerCase());
      const hashedPhone = phone ? sha256Hex(String(phone).replace(/\D/g, "")) : undefined;

      const fbPayload = {
        data: [
          {
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            user_data: {
              em: hashedEmail,
              ...(hashedPhone ? { ph: hashedPhone } : {}),
            },
            custom_data: {
              lead_type: "validated_cin",
              company_name: verifiedCompanyName,
            },
          },
        ],
        access_token: fbAccessToken,
      };

      const fbResp = await fetch(`https://graph.facebook.com/v18.0/${fbPixelId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fbPayload),
      });

      const fbText = await fbResp.text();
      console.info("Facebook CAPI response", { status: fbResp.status, textSnippet: fbText.slice(0, 200) });
    } catch (fbErr) {
      console.error("Facebook Conversions API error", fbErr);
      // continue — don't fail the flow for analytics failure
    }
  } else {
    console.info("FB_CONVERSION_API_TOKEN not set - skipping server-side CAPI");
  }

  // Final success response
  return new Response(
    JSON.stringify({
      ok: true,
      accepted: true,
      verifiedCompanyName,
      debugSignatureInfo: debugSignatureInfo, // useful to copy/paste to Cashfree support for debugging
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
