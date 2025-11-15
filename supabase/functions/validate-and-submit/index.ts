import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";
import { createHash, createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function normalizeName(s: string | undefined) {
  if (!s) return "";
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    console.error("Invalid JSON body", e.message);
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { companyName, cin, founderName, founderBackground, idea, revenueModel, usp, email, phone } = body || {};

  if (!companyName || !cin || !founderName || !idea || !revenueModel || !usp || !email) {
    return new Response(JSON.stringify({ ok: false, error: "Missing required fields" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Basic CIN format check (21 chars alnum) — adjust if needed
  const cinNormalized = String(cin || "").toUpperCase();
  if (!/^[A-Z0-9]{21}$/.test(cinNormalized)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid CIN format" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Cashfree credentials
  const clientId = Deno.env.get("CASHFREE_CLIENT_ID");
  const clientSecret = Deno.env.get("CASHFREE_CLIENT_SECRET");

  if (!clientId || !clientSecret) {
    console.error("Missing Cashfree credentials in env");
    return new Response(JSON.stringify({ ok: false, error: "Server configuration error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Call Cashfree CIN verify (production)
  let verificationData: any = null;
  try {
    const cashfreeUrl = "https://api.cashfree.com/verification/cin";
    const payload = { verification_id: `LAXNAR-${Date.now()}`, cin: cinNormalized };

    const cashfreeResp = await fetch(cashfreeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
      },
      body: JSON.stringify(payload),
      // set a timeout in your platform or use AbortController if needed
    });

    const text = await cashfreeResp.text();
    try {
      verificationData = JSON.parse(text);
    } catch (e) {
      console.error("Cashfree returned non-JSON:", text);
      return new Response(JSON.stringify({ ok: false, error: "Verification service error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!cashfreeResp.ok) {
      console.error("Cashfree error", cashfreeResp.status, verificationData);
      // pass provider message if available
      const msg = verificationData?.message || verificationData?.error || "Verification failed";
      return new Response(JSON.stringify({ ok: false, accepted: false, error: msg }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("Error calling Cashfree:", err);
    return new Response(JSON.stringify({ ok: false, error: "Verification service unavailable. Please try later." }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Inspect provider fields safely (adapt field names to actual API response)
  const companyStatus = verificationData.company_status || verificationData.status || "";
  const companyType = verificationData.company_type || verificationData.type || verificationData.company_class || "";
  const verifiedCompanyName = verificationData.company_name || verificationData.name || "";

  if (!companyStatus || String(companyStatus).toLowerCase() !== "active") {
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

  if (!companyType || !String(companyType).toLowerCase().includes("private")) {
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

  // Basic name fuzzy check (first 8 chars)
  const submittedNorm = normalizeName(companyName);
  const verifiedNorm = normalizeName(verifiedCompanyName);
  if (submittedNorm && verifiedNorm) {
    const match =
      submittedNorm.includes(verifiedNorm.substring(0, Math.min(8, verifiedNorm.length))) ||
      verifiedNorm.includes(submittedNorm.substring(0, Math.min(8, submittedNorm.length)));
    if (!match) {
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

  // Save to Supabase
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase env");
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
      idea: idea,
      revenue_model: revenueModel,
      usp: usp,
      email: email,
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
  } catch (e) {
    console.error("Error inserting to Supabase", e);
    return new Response(JSON.stringify({ ok: false, error: "Database error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Send Facebook Conversions API (hash PII)
  const fbPixelId = Deno.env.get("FB_PIXEL_ID") ?? "864907882634894";
  const fbAccessToken = Deno.env.get("FB_CONVERSION_API_TOKEN");
  if (fbAccessToken) {
    try {
      const hashedEmail = sha256Hex(String(email).trim().toLowerCase());
      const hashedPhone = phone ? sha256Hex(String(phone).replace(/\D/g, "")) : undefined;

      await fetch(`https://graph.facebook.com/v18.0/${fbPixelId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        }),
      });
    } catch (fbErr) {
      console.error("Facebook Conversions error", fbErr);
    }
  }

  return new Response(
    JSON.stringify({
      ok: true,
      accepted: true,
      verifiedCompanyName,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
