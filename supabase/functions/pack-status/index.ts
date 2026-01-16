// Supabase Edge Function: packs-status
// Checks job/pack status and returns a signed URL when ready.

import { createClient } from "npm:@supabase/supabase-js@2";

type Body = { job_id: string } | { dataset_id: string; variant: "mini" | "full" };

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const body = (await req.json()) as any as Partial<Body>;

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json({ error: "Missing Supabase service env" }, { status: 500 });
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

    let dataset_id = "";
    let variant: "mini" | "full" = "mini";

    if ("job_id" in body && body.job_id) {
      const job_id = String((body as any).job_id).trim();
      const { data: job, error: jErr } = await supabase
        .from("prism_pack_jobs")
        .select("job_id,status,error,dataset_id,variant")
        .eq("job_id", job_id)
        .single();
      if (jErr) throw jErr;
      dataset_id = String(job.dataset_id);
      variant = job.variant;
    } else {
      dataset_id = String((body as any).dataset_id || "").trim();
      variant = String((body as any).variant || "") as any as "mini" | "full";
      if (!dataset_id) return Response.json({ error: "dataset_id required" }, { status: 400 });
      if (variant !== "mini" && variant !== "full")
        return Response.json({ error: "variant must be mini|full" }, { status: 400 });
    }

    const { data: pack, error: pErr } = await supabase
      .from("prism_packs")
      .select("dataset_id,variant,storage_path,status,error")
      .eq("dataset_id", dataset_id)
      .eq("variant", variant)
      .single();
    if (pErr) throw pErr;

    if (pack.status === "ready") {
      const { data: signed, error: sErr } = await supabase.storage
        .from("prism-packs")
        .createSignedUrl(pack.storage_path, 60 * 60);
      if (sErr) throw sErr;
      return Response.json({
        status: "ready",
        dataset_id,
        variant,
        download_url: signed.signedUrl,
        storage_path: pack.storage_path,
      });
    }

    return Response.json({ status: pack.status, dataset_id, variant, error: pack.error ?? null });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ error: msg }, { status: 500 });
  }
});
