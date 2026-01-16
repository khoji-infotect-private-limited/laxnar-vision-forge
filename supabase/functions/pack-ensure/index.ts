// Supabase Edge Function: packs-ensure
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

type Body = { dataset_id: string; variant: "mini" | "full" };

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const body = (await req.json()) as Partial<Body>;
    const dataset_id = String(body.dataset_id || "").trim();
    const variant = String(body.variant || "") as any as "mini" | "full";
    if (!dataset_id) return Response.json({ error: "dataset_id required" }, { status: 400 });
    if (variant !== "mini" && variant !== "full")
      return Response.json({ error: "variant must be mini|full" }, { status: 400 });

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json({ error: "Missing Supabase service env" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    // Get pack row (storage_path/status)
    const { data: pack, error: packErr } = await supabase
      .from("prism_packs")
      .select("dataset_id,variant,storage_path,status,error")
      .eq("dataset_id", dataset_id)
      .eq("variant", variant)
      .maybeSingle();
    if (packErr) throw packErr;
    if (!pack) return Response.json({ error: "Unknown dataset/variant (missing prism_packs row)" }, { status: 404 });

    if (pack.status === "ready") {
      const { data: signed, error: sErr } = await supabase.storage
        .from("prism-packs")
        .createSignedUrl(pack.storage_path, 60 * 60); // 1 hour
      if (sErr) throw sErr;
      return Response.json({
        status: "ready",
        dataset_id,
        variant,
        download_url: signed.signedUrl,
        storage_path: pack.storage_path,
      });
    }

    // Upsert job (unique constraint dataset_id+variant)
    const { data: job, error: jobErr } = await supabase
      .from("prism_pack_jobs")
      .upsert({ dataset_id, variant, status: "queued" }, { onConflict: "dataset_id,variant" })
      .select("job_id,status")
      .single();
    if (jobErr) throw jobErr;

    // Mark pack status building (best-effort)
    await supabase
      .from("prism_packs")
      .update({ status: "building", error: null })
      .eq("dataset_id", dataset_id)
      .eq("variant", variant);

    return Response.json({
      status: "building",
      dataset_id,
      variant,
      job_id: job.job_id,
      message: "Pack build queued. A worker will build and upload the SQLite FTS pack.",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ error: msg }, { status: 500 });
  }
});
