// Supabase Edge Function: pack-status
// Checks job/pack status and returns a signed URL when ready.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Body =
  | { job_id: string }
  | { dataset_id: string; variant: "mini" | "full" };

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    const body = (await req.json()) as Partial<Body>;
    console.log("[pack-status] Request body:", JSON.stringify(body));

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[pack-status] Missing Supabase service env");
      return Response.json({ error: "Missing Supabase service env" }, { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    let dataset_id = "";
    let variant: "mini" | "full" = "mini";

    // Check if lookup by job_id
    if ("job_id" in body && body.job_id) {
      const job_id = String(body.job_id).trim();
      console.log("[pack-status] Looking up by job_id:", job_id);

      const { data: job, error: jErr } = await supabase
        .from("pack_jobs")
        .select("id, status, error_message, pack_id")
        .eq("id", job_id)
        .single();

      if (jErr) {
        console.error("[pack-status] Job lookup error:", jErr.message);
        throw jErr;
      }

      // Get pack details from pack_id
      const { data: pack, error: pErr } = await supabase
        .from("packs")
        .select("dataset_id, variant")
        .eq("id", job.pack_id)
        .single();

      if (pErr) {
        console.error("[pack-status] Pack lookup from job error:", pErr.message);
        throw pErr;
      }

      dataset_id = pack.dataset_id;
      variant = pack.variant as "mini" | "full";
    } else {
      // Lookup by dataset_id + variant
      dataset_id = String((body as any).dataset_id || "").trim();
      variant = String((body as any).variant || "") as "mini" | "full";

      if (!dataset_id) {
        return Response.json({ error: "dataset_id required" }, { status: 400, headers: corsHeaders });
      }
      if (variant !== "mini" && variant !== "full") {
        return Response.json({ error: "variant must be mini|full" }, { status: 400, headers: corsHeaders });
      }
    }

    console.log("[pack-status] Checking pack status for dataset:", dataset_id, "variant:", variant);

    const { data: pack, error: pErr } = await supabase
      .from("packs")
      .select("id, dataset_id, variant, storage_path, status, error_message")
      .eq("dataset_id", dataset_id)
      .eq("variant", variant)
      .maybeSingle();

    if (pErr) {
      console.error("[pack-status] Pack query error:", pErr.message);
      throw pErr;
    }

    if (!pack) {
      return Response.json({ error: "Pack not found" }, { status: 404, headers: corsHeaders });
    }

    if (pack.status === "ready" && pack.storage_path) {
      console.log("[pack-status] Pack ready, generating signed URL");
      const { data: signed, error: sErr } = await supabase.storage
        .from("prism-packs")
        .createSignedUrl(pack.storage_path, 60 * 60); // 1 hour

      if (sErr) {
        console.error("[pack-status] Signed URL error:", sErr.message);
        throw sErr;
      }

      return Response.json({
        status: "ready",
        dataset_id,
        variant,
        download_url: signed.signedUrl,
        storage_path: pack.storage_path
      }, { headers: corsHeaders });
    }

    console.log("[pack-status] Pack status:", pack.status);
    return Response.json({
      status: pack.status,
      dataset_id,
      variant,
      error: pack.error_message ?? null
    }, { headers: corsHeaders });

  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[pack-status] Error:", msg);
    return Response.json({ error: msg }, { status: 500, headers: corsHeaders });
  }
});
