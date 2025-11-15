import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { companyName, cin, founderName, founderBackground, idea, revenueModel, usp, email, phone } = await req.json();

    console.log('Validating CIN:', cin);

    // Normalize CIN to uppercase
    const normalizedCin = cin.toUpperCase();

    // Get Cashfree credentials
    const clientId = Deno.env.get('CASHFREE_CLIENT_ID');
    const clientSecret = Deno.env.get('CASHFREE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error('Missing Cashfree credentials');
      return new Response(
        JSON.stringify({ ok: false, error: 'Configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Cashfree CIN Verification API
    const cashfreeResponse = await fetch('https://api.cashfree.com/verification/cin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
      },
      body: JSON.stringify({
        cin: normalizedCin,
      }),
    });

    const verificationData = await cashfreeResponse.json();
    console.log('Cashfree response:', JSON.stringify(verificationData));

    if (!cashfreeResponse.ok) {
      console.error('Cashfree API error:', verificationData);
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: 'Verification service unavailable. Please try again later or contact hello@laxnar.ai.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if company is Active and Private Limited
    const companyStatus = verificationData.company_status || verificationData.status;
    const companyType = verificationData.company_type || verificationData.type;
    const verifiedCompanyName = verificationData.company_name || verificationData.name;

    // Check if company is Active
    if (companyStatus !== 'Active') {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          accepted: false,
          error: 'We only accept Active Private Limited companies. If you think this is an error, contact hello@laxnar.ai.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if company is Private Limited
    if (!companyType || !companyType.toLowerCase().includes('private')) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          accepted: false,
          error: 'We only accept Active Private Limited companies. If you think this is an error, contact hello@laxnar.ai.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if company name matches (basic check - lowercase and trim)
    const submittedNameNormalized = companyName.toLowerCase().trim().replace(/\s+/g, ' ');
    const verifiedNameNormalized = verifiedCompanyName.toLowerCase().trim().replace(/\s+/g, ' ');
    
    if (!submittedNameNormalized.includes(verifiedNameNormalized.substring(0, 10)) && 
        !verifiedNameNormalized.includes(submittedNameNormalized.substring(0, 10))) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          accepted: false,
          error: 'Company name does not match CIN record — please confirm.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // All validation passed - store submission
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: insertError } = await supabase.from('submissions').insert({
      company_name: companyName,
      cin: normalizedCin,
      founder_name: founderName,
      founder_background: founderBackground,
      idea: idea,
      revenue_model: revenueModel,
      usp: usp,
      email: email,
      phone: phone || null,
      company_status: companyStatus,
      verified_company_name: verifiedCompanyName,
    });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to save submission' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Submission saved successfully');

    // Send Conversions API event
    const fbPixelId = '864907882634894';
    const fbAccessToken = Deno.env.get('FB_CONVERSION_API_TOKEN');
    
    if (fbAccessToken) {
      try {
        await fetch(`https://graph.facebook.com/v18.0/${fbPixelId}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: [{
              event_name: 'Lead',
              event_time: Math.floor(Date.now() / 1000),
              action_source: 'website',
              user_data: {
                em: email,
                ph: phone,
              },
              custom_data: {
                lead_type: 'validated_cin',
                company_name: verifiedCompanyName,
              },
            }],
            access_token: fbAccessToken,
          }),
        });
      } catch (fbError) {
        console.error('Facebook Conversions API error:', fbError);
      }
    }

    return new Response(
      JSON.stringify({ 
        ok: true, 
        accepted: true,
        verifiedCompanyName: verifiedCompanyName,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-and-submit function:', error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
