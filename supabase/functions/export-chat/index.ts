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

    const { format = 'json', bundleId } = await req.json();

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

    console.log(`Exporting chat for user: ${user.id}, format: ${format}, bundleId: ${bundleId || 'all'}`);

    let query = supabase
      .from('chat_messages')
      .select('user_message, assistant_message, model, tokens_used, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (bundleId) {
      query = query.eq('bundle_id', bundleId);
    }

    const { data: messages, error: messagesError } = await query;
    if (messagesError) throw messagesError;

    if (format === 'csv') {
      const csvHeader = 'Timestamp,Role,Message,Model,Tokens\n';
      const csvRows = messages?.flatMap(msg => [
        `"${msg.created_at}","user","${(msg.user_message || '').replace(/"/g, '""')}","","0"`,
        `"${msg.created_at}","assistant","${(msg.assistant_message || '').replace(/"/g, '""')}","${msg.model || ''}","${msg.tokens_used || 0}"`,
      ]).join('\n') || '';

      console.log(`Exported ${messages?.length || 0} messages as CSV`);

      return new Response(csvHeader + csvRows, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="chat-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Default to JSON
    const exportData = {
      exportedAt: new Date().toISOString(),
      userId: user.id,
      bundleId: bundleId || null,
      messageCount: messages?.length || 0,
      messages: messages?.map(msg => ({
        timestamp: msg.created_at,
        userMessage: msg.user_message,
        assistantMessage: msg.assistant_message,
        model: msg.model,
        tokensUsed: msg.tokens_used,
      })),
    };

    console.log(`Exported ${messages?.length || 0} messages as JSON`);

    return new Response(JSON.stringify(exportData, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error exporting chat:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
