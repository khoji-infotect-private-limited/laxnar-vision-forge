import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching stats for user: ${user.id}`);

    // Get bundle statistics
    const { data: bundles, error: bundlesError } = await supabase
      .from('bundles')
      .select('id, name, document_count, chunk_count, size_bytes, is_active, created_at')
      .eq('user_id', user.id);

    if (bundlesError) throw bundlesError;

    // Get chat message count
    const { count: messageCount, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (messagesError) throw messagesError;

    // Get pack statistics
    const { data: packs, error: packsError } = await supabase
      .from('packs')
      .select('id, status, size_bytes, created_at')
      .eq('user_id', user.id);

    if (packsError) throw packsError;

    const stats = {
      bundles: {
        total: bundles?.length || 0,
        active: bundles?.filter(b => b.is_active).length || 0,
        totalDocuments: bundles?.reduce((sum, b) => sum + (b.document_count || 0), 0) || 0,
        totalChunks: bundles?.reduce((sum, b) => sum + (b.chunk_count || 0), 0) || 0,
        totalSizeBytes: bundles?.reduce((sum, b) => sum + (b.size_bytes || 0), 0) || 0,
      },
      messages: {
        total: messageCount || 0,
      },
      packs: {
        total: packs?.length || 0,
        byStatus: {
          pending: packs?.filter(p => p.status === 'pending').length || 0,
          downloading: packs?.filter(p => p.status === 'downloading').length || 0,
          ready: packs?.filter(p => p.status === 'ready').length || 0,
          failed: packs?.filter(p => p.status === 'failed').length || 0,
        },
        totalSizeBytes: packs?.reduce((sum, p) => sum + (p.size_bytes || 0), 0) || 0,
      },
      generatedAt: new Date().toISOString(),
    };

    console.log(`Stats generated successfully for user: ${user.id}`);

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching bundle stats:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
