import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

    const { bundleId, type = 'brief' } = await req.json();

    if (!bundleId) {
      return new Response(JSON.stringify({ error: 'bundleId is required' }), {
        status: 400,
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

    console.log(`Generating ${type} summary for bundle: ${bundleId}`);

    // Get bundle info
    const { data: bundle, error: bundleError } = await supabase
      .from('bundles')
      .select('*')
      .eq('id', bundleId)
      .eq('user_id', user.id)
      .single();

    if (bundleError || !bundle) {
      return new Response(JSON.stringify({ error: 'Bundle not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get recent chat messages for context
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('user_message, assistant_message')
      .eq('bundle_id', bundleId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const chatContext = messages?.map(m => 
      `Q: ${m.user_message}\nA: ${m.assistant_message}`
    ).join('\n\n') || 'No chat history available.';

    const systemPrompt = type === 'detailed' 
      ? `You are a helpful assistant that creates detailed summaries. Analyze the bundle information and chat history to provide a comprehensive overview including key topics, patterns, and insights.`
      : `You are a helpful assistant that creates brief summaries. Provide a concise 2-3 sentence overview of the bundle based on its metadata and recent interactions.`;

    const userPrompt = `Bundle: "${bundle.name}"
Description: ${bundle.description || 'No description'}
Documents: ${bundle.document_count || 0}
Chunks: ${bundle.chunk_count || 0}

Recent Chat Context:
${chatContext}

Please provide a ${type} summary of this bundle.`;

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const response = await fetch('https://api.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: type === 'detailed' ? 1024 : 256,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const summary = aiData.choices?.[0]?.message?.content || 'Unable to generate summary.';

    console.log(`Summary generated successfully for bundle: ${bundleId}`);

    return new Response(JSON.stringify({
      bundleId,
      bundleName: bundle.name,
      summaryType: type,
      summary,
      generatedAt: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
