import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// -------------------------
// Utilities
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

// -------------------------
// FB event helper
// -------------------------
async function sendFacebookEvent(eventName: string, email: string, phone: string, fbp?: string, fbc?: string) {
  try {
    const pixelId = "921840036600612";
    const accessToken =
      "EAAQgCWx87AYBOxl3EzRL5jJ1cq0c0dHkKTZBhj3EqZBoY0vZCOCvA7Vo2dZAI2Hn7IxDp2E62tTCMnfMmaTXvkOlSaRZCj4XsqwCJWiUTsVR4HQ19cJCY8Pq12lKq0v4gJlNGwZBVWk6l0uvOnWJbXZBxGE2bvWs87EzZBrMKpQ96ZAWz8mZABCAD9mq3LgnVRiZCfD98ZC";
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

    // Store submission in database
    const { data, error } = await supabase
      .from("submissions")
      .insert({
        company_name: companyName,
        founder_name: founderName,
        founder_background: founderBackground,
        idea,
        revenue_model: revenueModel,
        usp,
        email,
        phone,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({ error: "Failed to save submission" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send Facebook event
    await sendFacebookEvent("Lead", email, phone, fbp, fbc);

    console.log("Submission successful:", data.id);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        submissionId: data.id,
        message: "Submission received successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unhandled exception in handler:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
