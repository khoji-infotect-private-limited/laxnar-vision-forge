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

  const startTime = Date.now();

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Test database connectivity
    const { error: dbError } = await supabase
      .from('datasets')
      .select('id')
      .limit(1);

    const dbStatus = dbError ? 'unhealthy' : 'healthy';
    const dbLatency = Date.now() - startTime;

    // Check required environment variables
    const envVars = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
    ];
    
    const envStatus = envVars.every(v => Deno.env.get(v)) ? 'healthy' : 'degraded';
    const missingEnv = envVars.filter(v => !Deno.env.get(v));

    const health = {
      status: dbStatus === 'healthy' && envStatus === 'healthy' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: {
          status: dbStatus,
          latencyMs: dbLatency,
          error: dbError?.message || null,
        },
        environment: {
          status: envStatus,
          missing: missingEnv.length > 0 ? missingEnv : null,
        },
      },
      uptime: Deno.version.deno,
    };

    console.log(`Health check completed: ${health.status}`);

    const statusCode = health.status === 'healthy' ? 200 : 503;

    return new Response(JSON.stringify(health), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return new Response(JSON.stringify({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
