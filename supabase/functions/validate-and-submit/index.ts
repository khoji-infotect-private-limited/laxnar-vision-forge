// server.ts
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// -------------------------
// small utilities
// -------------------------
function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  return crypto.subtle.digest("SHA-256", data).then((buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  );
}

function normalizeName(s?: string): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/\b(private\s+limited|pvt\.?\s*ltd\.?|ltd\.?|llc|inc\.?|corporation|corp\.?)\b/gi, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeName(str1);
  const s2 = normalizeName(str2);
  const len1 = s1.length,
    len2 = s2.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= len1; i++) matrix[i] = [i];
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1 : 1 - distance / maxLen;
}

function isFounderInDirectors(
  founderName: string,
  directorDetails: any[],
): { matched: boolean; matchedDirectorName: string | null } {
  if (!directorDetails || !Array.isArray(directorDetails)) return { matched: false, matchedDirectorName: null };
  const normalizedFounder = normalizeName(founderName);
  const founderParts = normalizedFounder.split(/\s+/);
  for (const director of directorDetails) {
    const directorName = director?.name || director?.director_name || "";
    const normalizedDirector = normalizeName(directorName);
    const allPartsMatch = founderParts.every((part) => normalizedDirector.includes(part) && part.length > 0);
    if (allPartsMatch) return { matched: true, matchedDirectorName: directorName };
  }
  return { matched: false, matchedDirectorName: null };
}

// -------------------------
// Cashfree: Public Key helpers (RSA-OAEP + base64)
// -------------------------
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----(BEGIN|END)[\s\S]+?-----/g, "").replace(/\s+/g, "");
  const binaryString = atob(b64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function rsaEncryptBase64(message: string, publicKeyPem: string) {
  const spki = pemToArrayBuffer(publicKeyPem);
  const key = await crypto.subtle.importKey("spki", spki, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]);
  const data = new TextEncoder().encode(message);
  const encrypted = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, key, data);
  return arrayBufferToBase64(encrypted);
}

/**
 * verifyCINWithCashfree - PUBLIC KEY flow
 * message = `${clientId}.${timestamp}` encrypted with Cashfree PUBLIC KEY (RSA-OAEP SHA-256) and base64
 */
async function verifyCINWithCashfree(
  cin: string,
  cashfreeClientId: string,
  cashfreeClientSecret: string,
  cashfreePublicKeyPem: string,
  useSandbox = true,
) {
  try {
    console.log(`[Cashfree] Starting verification for CIN: ${cin}`);
    if (!cashfreePublicKeyPem || !cashfreePublicKeyPem.includes("BEGIN PUBLIC KEY")) {
      console.error(
        "[Cashfree] Invalid PUBLIC KEY PEM - make sure CASHFREE_PUBLIC_KEY_PEM contains -----BEGIN PUBLIC KEY-----",
      );
      return { error: "invalid_public_key_pem", errorType: "config_error" };
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const message = `${cashfreeClientId}.${timestamp}`; // CORRECT message

    // Create RSA-OAEP encrypted signature and base64 it
    const signature = await rsaEncryptBase64(message, cashfreePublicKeyPem);

    // Defensive check: RSA-encrypted base64 for a 2048-bit key should be large (~344).
    console.log("[Cashfree] Produced signature base64 length:", signature.length);
    if (signature.length < 200) {
      // Very likely you produced an HMAC or wrong key/format. Fail fast and log clearly.
      console.error(
        "[Cashfree] Signature length suspiciously short (<200) — this indicates wrong algorithm/key. Aborting request to avoid signature mismatch.",
      );
      return { error: "signature_too_short", length: signature.length, errorType: "config_error" };
    }

    const url = useSandbox
      ? "https://sandbox.cashfree.com/verification/cin"
      : "https://api.cashfree.com/verification/cin";
    const headers: Record<string, string> = {
      "x-client-id": cashfreeClientId,
      "x-cf-timestamp": timestamp,
      "x-cf-signature": signature,
      "Content-Type": "application/json",
    };

    // Log masked headers for debug (don't log full signature)
    console.log("[Cashfree] Outgoing headers:", {
      "x-client-id": cashfreeClientId.substring(0, 8) + "...",
      "x-cf-timestamp": timestamp,
      "x-cf-signature": signature.slice(0, 8) + "..." + signature.slice(-8),
    });

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ cin }),
    });

    let body;
    try {
      body = await res.json();
    } catch (e) {
      body = { raw: await res.text() };
    }
    console.log("[Cashfree] HTTP", res.status, "ok=", res.ok);
    if (!res.ok) {
      console.error("[Cashfree] API returned error:", JSON.stringify(body).slice(0, 800));
      return {
        error: body,
        status: res.status,
        errorType: "api_error",
        errorMessage: body?.message || body?.error || "Unknown",
      };
    }
    return body;
  } catch (err) {
    console.error("[Cashfree] Exception", err);
    return { error: err instanceof Error ? err.message : String(err), errorType: "exception" };
  }
}

// -------------------------
// OpenAI helper (unchanged)
// -------------------------
async function findCINWithAI(companyName: string, founderName: string, openaiApiKey: string) {
  try {
    console.log(`[OpenAI Web Search] Starting search for: ${companyName}, Founder: ${founderName}`);
    const searchQuery = `Find the Corporate Identification Number (CIN) for the Indian company "${companyName}" with founder/director ${founderName}. A CIN is a 21-character alphanumeric code in format [A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}. Return ONLY the exact 21-character CIN if found, or "NO_CIN_FOUND" if not available.`;
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${openaiApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-5-mini", tools: [{ type: "web_search" }], input: searchQuery }),
    });
    if (!response.ok) {
      const err = await response.text();
      console.error("[OpenAI] API error", response.status, err);
      return { cin: null, confidence: "error", rawResponse: err, reason: `OpenAI status ${response.status}` };
    }
    const data = await response.json();
    const outputItems = data.output || [];
    const messageItem = outputItems.find((item: any) => item.type === "message");
    if (!messageItem)
      return { cin: null, confidence: "no_response", rawResponse: JSON.stringify(data), reason: "No message content" };
    const textContent = messageItem.content?.find((c: any) => c.type === "output_text");
    const aiResponse = textContent?.text?.trim() || "";
    const cinMatch = aiResponse.match(/[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}/);
    if (cinMatch)
      return { cin: cinMatch[0], confidence: "high", rawResponse: aiResponse, reason: "Found via web search" };
    if (aiResponse.toLowerCase().includes("not found") || aiResponse.includes("NO_CIN_FOUND")) {
      return { cin: null, confidence: "not_found", rawResponse: aiResponse, reason: "AI indicates not found" };
    }
    return {
      cin: null,
      confidence: "invalid_format",
      rawResponse: aiResponse,
      reason: "AI responded but no valid CIN format",
    };
  } catch (error) {
    console.error("[OpenAI] Exception", error);
    return {
      cin: null,
      confidence: "error",
      rawResponse: error instanceof Error ? error.message : String(error),
      reason: "Exception",
    };
  }
}

// -------------------------
// Facebook event helper (unchanged)
// -------------------------
async function sendFacebookEvent(eventName: string, email: string, phone: string, fbp?: string, fbc?: string) {
  try {
    const pixelId = "921840036600612";
    const accessToken =
      "EAAQgCWx87AYBOxl3EzRLN5jJ1cq0c0dHkKTZBhj3EqZBoY0vZCOCvA7Vo2dZAI2Hn7IxDp2E62tTCMnfMmaTXvkOlSaRZCj4XsqwCJWiUTsVR4HQ19cJCY8Pq12lKq0v4gJlNGwZBVWk6l0uvOnWJbXZBxGE2bvWs87EzZBrMKpQ96ZAWz8mZABCAD9mq3LgnVRiZCfD98ZC";
    const eventData = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          user_data: {
            em: [await sha256Hex(email.toLowerCase().trim())],
            ph: [await sha256Hex(phone.replace(/\D/g, ""))],
            ...(fbp && { fbp }),
            ...(fbc && { fbc }),
          },
        },
      ],
    };
    await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });
  } catch (error) {
    console.error(`[Facebook] Error:`, error);
  }
}

// -------------------------
// Optional: run a single sandbox test on startup if CASHFREE_RUN_TEST="true"
// -------------------------
async function runStartupTestIfRequested() {
  const runTest = (Deno.env.get("CASHFREE_RUN_TEST") || "false").toLowerCase() === "true";
  if (!runTest) return;
  console.log("[StartupTest] CASHFREE_RUN_TEST=true — running quick sandbox test (will not modify DB).");
  const cfClientId = Deno.env.get("CASHFREE_CLIENT_ID")!;
  const cfPubPem = Deno.env.get("CASHFREE_PUBLIC_KEY_PEM")!;
  const cfUseSandbox = (Deno.env.get("CASHFREE_USE_SANDBOX") ?? "true").toLowerCase() !== "false";
  if (!cfClientId || !cfPubPem) {
    console.error("[StartupTest] Cashfree env vars missing; cannot run test.");
    return;
  }
  try {
    const testCIN = "U72900KA2020PTC123456";
    const r = await verifyCINWithCashfree(testCIN, cfClientId, "", cfPubPem, cfUseSandbox);
    console.log("[StartupTest] Result (truncated):", JSON.stringify(r).slice(0, 800));
  } catch (e) {
    console.error("[StartupTest] Exception", e);
  }
}

// call startup test (non-blocking)
runStartupTestIfRequested().catch((e) => console.warn("[StartupTest] failed", e));

// -------------------------
// Main server handler
// -------------------------
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const body = await req.json();
    const {
      companyName,
      founderName,
      founderBackground,
      idea,
      revenueModel,
      usp,
      email,
      phone,
      fbp,
      fbc,
      cinOverride,
    } = body;

    console.log("Parsed request data:", {
      companyName,
      founderName,
      email,
      phone: phone ? phone.slice(0, 3) + "XXX" : undefined,
    });

    if (!companyName || !founderName || !email || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("submissions")
      .insert({
        company_name: companyName,
        cin: cinOverride || "",
        founder_name: founderName,
        founder_background: founderBackground,
        idea,
        revenue_model: revenueModel,
        usp,
        email,
        phone,
      });

    // Determine CIN (override or AI)
    let cin: string | null = null;
    let confidence = "unknown";
    let rawResponse = "";
    let reason: string | undefined;
    let sources: any[] | undefined;

    if (cinOverride && /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(cinOverride)) {
      cin = cinOverride;
      confidence = "manual";
      rawResponse = "Provided by user";
      reason = "Manual override";
    } else {
      const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
      if (!openaiApiKey)
        return new Response(JSON.stringify({ error: "AI not configured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const aiRes = await findCINWithAI(companyName, founderName, openaiApiKey);
      cin = aiRes.cin;
      confidence = aiRes.confidence;
      rawResponse = aiRes.rawResponse;
      reason = aiRes.reason;
      sources = aiRes.sources;
    }

    if (!cin) {
      const { data } = await supabase
        .from("impure_leads")
        .insert({
          company_name: companyName,
          founder_name: founderName,
          founder_background: founderBackground,
          idea,
          revenue_model: revenueModel,
          usp,
          email,
          phone,
          cin_found_by_ai: null,
          ai_search_confidence: confidence,
          ai_search_failed: true,
          rejection_reason: `CIN not found: ${reason || "none"}`,
          verification_error_details: { ai_confidence: confidence, raw_response: rawResponse, sources: sources || [] },
        })
        .select()
        .single();
      await sendFacebookEvent("Lead", email, phone, fbp, fbc);
      return new Response(JSON.stringify({ ok: true, leadType: "impure", leadId: data.id, reason: "CIN not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cashfree verification
    const cfClientId = Deno.env.get("CASHFREE_CLIENT_ID")!;
    const cfClientSecret = Deno.env.get("CASHFREE_CLIENT_SECRET") || "";
    const cfPublicKeyPem = Deno.env.get("CASHFREE_PUBLIC_KEY_PEM")!;
    const cfUseSandbox = (Deno.env.get("CASHFREE_USE_SANDBOX") ?? "true").toLowerCase() !== "false";

    if (!cfClientId || !cfPublicKeyPem) {
      return new Response(JSON.stringify({ error: "Cashfree not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optional quick test call removed in normal flow to avoid duplicate logs in production.
    const verificationResult = await verifyCINWithCashfree(
      cin,
      cfClientId,
      cfClientSecret,
      cfPublicKeyPem,
      cfUseSandbox,
    );

    if (verificationResult && verificationResult.errorType === "config_error") {
      // configuration/signature creation problem - store as impure for manual review
      const { data } = await supabase
        .from("impure_leads")
        .insert({
          company_name: companyName,
          founder_name: founderName,
          founder_background: founderBackground,
          idea,
          revenue_model: revenueModel,
          usp,
          email,
          phone,
          cin_found_by_ai: cin,
          ai_search_confidence: confidence,
          rejection_reason: `Verification config error: ${verificationResult.error}`,
          verification_error_details: verificationResult,
        })
        .select()
        .single();
      await sendFacebookEvent("lead_A", email, phone, fbp, fbc);
      return new Response(
        JSON.stringify({
          ok: false,
          leadType: "impure",
          leadId: data.id,
          reason: "Verification config error",
          details: verificationResult,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (verificationResult && verificationResult.error) {
      // API error from Cashfree
      const { data } = await supabase
        .from("impure_leads")
        .insert({
          company_name: companyName,
          founder_name: founderName,
          founder_background: founderBackground,
          idea,
          revenue_model: revenueModel,
          usp,
          email,
          phone,
          cin_found_by_ai: cin,
          ai_search_confidence: confidence,
          rejection_reason: `Cashfree API error: ${verificationResult.errorMessage || JSON.stringify(verificationResult.error)}`,
          verification_error_details: verificationResult,
        })
        .select()
        .single();
      await sendFacebookEvent("lead_A", email, phone, fbp, fbc);
      return new Response(
        JSON.stringify({ ok: true, leadType: "impure", leadId: data.id, reason: "Verification failed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Successful verification path (structure may vary per Cashfree response)
    const companyData = verificationResult.company_details || verificationResult;
    const verifiedCompanyName = companyData.company_name || "";
    const companyStatus = (companyData.company_status || "").toString();
    const directorDetails = companyData.directors || [];

    if ((companyStatus || "").toLowerCase() !== "active") {
      const { data } = await supabase
        .from("impure_leads")
        .insert({
          company_name: companyName,
          founder_name: founderName,
          founder_background: founderBackground,
          idea,
          revenue_model: revenueModel,
          usp,
          email,
          phone,
          cin_found_by_ai: cin,
          ai_search_confidence: confidence,
          verified_company_name: verifiedCompanyName,
          company_status: companyStatus,
          director_details: directorDetails,
          rejection_reason: `Company not active (${companyStatus})`,
        })
        .select()
        .single();
      await sendFacebookEvent("lead_A", email, phone, fbp, fbc);
      return new Response(
        JSON.stringify({ ok: true, leadType: "impure", leadId: data.id, reason: "Company not active" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const nameSimilarity = calculateSimilarity(companyName, verifiedCompanyName);
    const { matched: directorMatch, matchedDirectorName } = isFounderInDirectors(founderName, directorDetails);
    const isPure = nameSimilarity >= 0.8 && directorMatch;

    if (isPure) {
      const { data } = await supabase
        .from("pure_conversions")
        .insert({
          company_name: companyName,
          founder_name: founderName,
          founder_background: founderBackground,
          idea,
          revenue_model: revenueModel,
          usp,
          email,
          phone,
          cin_found_by_ai: cin,
          ai_search_confidence: confidence,
          verified_company_name: verifiedCompanyName,
          verification_id: verificationResult.verification_id,
          reference_id: verificationResult.reference_id,
          company_status: companyStatus,
          cin_status: companyData.cin_status,
          registration_number: companyData.registration_number,
          incorporation_date: companyData.date_of_incorporation,
          incorporation_country: companyData.country_of_incorporation,
          director_details: directorDetails,
          company_name_match_score: nameSimilarity,
          director_name_match: directorMatch,
          matched_director_name: matchedDirectorName,
        })
        .select()
        .single();
      await sendFacebookEvent("CompleteRegistration", email, phone, fbp, fbc);
      return new Response(
        JSON.stringify({ ok: true, accepted: true, leadType: "pure", leadId: data.id, verifiedCompanyName }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } else {
      const rejectionReasons = [];
      if (nameSimilarity < 0.8)
        rejectionReasons.push(`Name similarity too low (${(nameSimilarity * 100).toFixed(0)}% < 80%)`);
      if (!directorMatch) rejectionReasons.push("Founder not found in director list");
      const { data } = await supabase
        .from("impure_leads")
        .insert({
          company_name: companyName,
          founder_name: founderName,
          founder_background: founderBackground,
          idea,
          revenue_model: revenueModel,
          usp,
          email,
          phone,
          cin_found_by_ai: cin,
          ai_search_confidence: confidence,
          verified_company_name: verifiedCompanyName,
          verification_id: verificationResult.verification_id,
          company_status: companyStatus,
          director_details: directorDetails,
          rejection_reason: rejectionReasons.join("; "),
          company_name_match_score: nameSimilarity,
          director_name_match: directorMatch,
        })
        .select()
        .single();
      await sendFacebookEvent("lead_A", email, phone, fbp, fbc);
      return new Response(
        JSON.stringify({ ok: true, leadType: "impure", leadId: data.id, reason: rejectionReasons.join("; ") }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    console.error("Unhandled exception in handler:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
