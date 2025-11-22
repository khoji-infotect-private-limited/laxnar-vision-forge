import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { passcode } = await req.json();
    const adminPasscode = Deno.env.get('ADMIN_PASSCODE');

    console.log('[ADMIN] Passcode verification attempt');

    // Verify passcode
    if (!passcode || passcode !== adminPasscode) {
      console.log('[ADMIN] Invalid passcode attempt');
      return new Response(
        JSON.stringify({ error: 'Invalid passcode' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[ADMIN] Passcode verified, fetching submissions');

    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all submissions
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ADMIN] Error fetching submissions:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch submissions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[ADMIN] Successfully fetched ${submissions?.length || 0} submissions`);

    return new Response(
      JSON.stringify({ submissions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[ADMIN] Error in get-submissions:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
