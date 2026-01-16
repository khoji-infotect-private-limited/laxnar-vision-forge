// Supabase Edge Function: pack-ensure
// Ensures a dataset pack exists:
// - If pack is ready: returns a signed download URL
// - Else: creates/updates a build job and returns job_id
//
// Requires env:
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
//
// Storage bucket: prism-packs (private recommended; we use signed URLs)

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Body = { dataset_id: string; variant: "mini" | "full" };

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Partial<Body>;
    const dataset_id = String(body.dataset_id || "").trim();
    const variant = String(body.variant || "") as "mini" | "full";

    if (!dataset_id) {
      return new Response(JSON.stringify({ error: "dataset_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (variant !== "mini" && variant !== "full") {
      return new Response(JSON.stringify({ error: "variant must be mini|full" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase service environment variables");
      return new Response(JSON.stringify({ error: "Missing Supabase service env" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Get pack row (storage_path/status)
    const { data: pack, error: packErr } = await supabase
      .from("packs")
      .select("dataset_id, variant, storage_path, status, error_message")
      .eq("dataset_id", dataset_id)
      .eq("variant", variant)
      .maybeSingle();

    if (packErr) {
      console.error("Error fetching pack:", packErr);
      throw packErr;
    }

    if (!pack) {
      return new Response(
        JSON.stringify({ error: "Unknown dataset/variant (missing packs row)" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (pack.status === "ready") {
      // Pack is ready - generate signed download URL
      const { data: signed, error: sErr } = await supabase.storage
        .from("prism-packs")
        .createSignedUrl(pack.storage_path, 60 * 60); // 1 hour

      if (sErr) {
        console.error("Error creating signed URL:", sErr);
        throw sErr;
      }

      console.log(`Pack ready for dataset ${dataset_id} variant ${variant}`);
      return new Response(
        JSON.stringify({
          status: "ready",
          dataset_id,
          variant,
          download_url: signed.signedUrl,
          storage_path: pack.storage_path,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Upsert job (unique constraint dataset_id+variant)
    const { data: job, error: jobErr } = await supabase
      .from("pack_jobs")
      .upsert(
        {
          pack_id: pack.dataset_id, // Use pack's dataset_id as reference
          user_id: "00000000-0000-0000-0000-000000000000", // System user placeholder
          job_type: `build_${variant}`,
          status: "queued",
        },
        { onConflict: "pack_id,job_type" }
      )
      .select("id, status")
      .single();

    if (jobErr) {
      console.error("Error upserting job:", jobErr);
      throw jobErr;
    }

    // Mark pack status as downloading (best-effort)
    await supabase
      .from("packs")
      .update({ status: "downloading", error_message: null })
      .eq("dataset_id", dataset_id)
      .eq("variant", variant);

    console.log(`Pack build queued for dataset ${dataset_id} variant ${variant}, job_id: ${job.id}`);
    return new Response(
      JSON.stringify({
        status: "building",
        dataset_id,
        variant,
        job_id: job.id,
        message: "Pack build queued. A worker will build and upload the SQLite FTS pack.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("pack-ensure error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
