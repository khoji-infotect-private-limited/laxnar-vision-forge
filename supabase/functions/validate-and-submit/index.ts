import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  return crypto.subtle.digest("SHA-256", data).then((buf) =>
    Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("")
  );
}

function normalizeName(s?: string): string {
  if (!s) return "";
  return s.toLowerCase().replace(/\b(private\s+limited|pvt\.?\s*ltd\.?|ltd\.?|llc|inc\.?|corporation|corp\.?)\b/gi, "")
    .replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}

function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeName(str1);
  const s2 = normalizeName(str2);
  const len1 = s1.length, len2 = s2.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= len1; i++) matrix[i] = [i];
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 1 : 1 - distance / maxLen;
}

function isFounderInDirectors(founderName: string, directorDetails: any[]): { matched: boolean; matchedDirectorName: string | null } {
  if (!directorDetails || !Array.isArray(directorDetails)) return { matched: false, matchedDirectorName: null };
  const normalizedFounder = normalizeName(founderName);
  const founderParts = normalizedFounder.split(/\s+/);
  for (const director of directorDetails) {
    const directorName = director?.name || director?.director_name || "";
    const normalizedDirector = normalizeName(directorName);
    const allPartsMatch = founderParts.every(part => normalizedDirector.includes(part) && part.length > 0);
    if (allPartsMatch) return { matched: true, matchedDirectorName: directorName };
  }
  return { matched: false, matchedDirectorName: null };
}

async function findCINWithAI(companyName: string, founderName: string, openaiApiKey: string) {
  try {
    console.log(`[OpenAI Web Search] Starting search for: ${companyName}, Founder: ${founderName}`);
    
    const searchQuery = `Find the Corporate Identification Number (CIN) for the Indian company "${companyName}" with founder/director ${founderName}. A CIN is a 21-character alphanumeric code in format [A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}. Return ONLY the exact 21-character CIN if found, or "NO_CIN_FOUND" if not available.`;
    
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${openaiApiKey}`, 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        tools: [{ type: "web_search" }],
        input: searchQuery
      }),
    });

    console.log(`[OpenAI Web Search] API Response Status: ${response.status}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[OpenAI Web Search] API Error:`, errorBody);
      return { 
        cin: null, 
        confidence: "error", 
        rawResponse: `API error: ${response.status} - ${errorBody}`,
        reason: `API request failed with status ${response.status}`
      };
    }

    const data = await response.json();
    const outputItems = data.output || [];
    
    console.log(`[OpenAI Web Search] Response structure:`, JSON.stringify(data, null, 2).substring(0, 500));
    
    // Find message item in output
    const messageItem = outputItems.find((item: any) => item.type === "message");
    
    if (!messageItem) {
      console.log(`[OpenAI Web Search] No message in response`);
      return {
        cin: null,
        confidence: "no_response",
        rawResponse: JSON.stringify(data),
        reason: "No message content in API response"
      };
    }
    
    // Extract text from message content
    const textContent = messageItem.content?.find((c: any) => c.type === "output_text");
    const aiResponse = textContent?.text?.trim() || "";
    const citations = textContent?.annotations || [];
    
    console.log(`[OpenAI Web Search] Raw AI Response: "${aiResponse}"`);
    console.log(`[OpenAI Web Search] Number of citations:`, citations.length);

    // Log sources consulted
    const sources = data.sources || [];
    if (sources.length > 0) {
      console.log(`[OpenAI Web Search] Sources consulted (${sources.length}):`, 
        sources.slice(0, 5).map((s: any) => s.url || s));
    }

    // Check for "not found" indicators
    if (aiResponse.includes("NO_CIN_FOUND") || 
        aiResponse.toLowerCase().includes("not found") || 
        aiResponse.toLowerCase().includes("unable to find") ||
        aiResponse.toLowerCase().includes("could not find")) {
      console.log(`[OpenAI Web Search] ❌ CIN not found via web search`);
      return { 
        cin: null, 
        confidence: "not_found", 
        rawResponse: aiResponse,
        reason: "Web search could not locate CIN",
        sources: sources.map((s: any) => ({ url: s.url, title: s.title }))
      };
    }

    // Extract CIN using regex
    const cinMatch = aiResponse.match(/[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}/);
    
    if (cinMatch) {
      console.log(`[OpenAI Web Search] ✅ CIN Found: ${cinMatch[0]}`);
      console.log(`[OpenAI Web Search] Found via ${sources.length} source(s)`);
      
      return { 
        cin: cinMatch[0], 
        confidence: "high", 
        rawResponse: aiResponse,
        reason: "Found via web search",
        sources: sources.map((s: any) => ({ url: s.url, title: s.title })),
        citations: citations.map((c: any) => ({ url: c.url, title: c.title }))
      };
    }

    // AI responded but no valid CIN format
    console.log(`[OpenAI Web Search] ⚠️ AI responded but no valid CIN format found`);
    return { 
      cin: null, 
      confidence: "invalid_format", 
      rawResponse: aiResponse,
      reason: "Web search returned results but no valid CIN format detected",
      sources: sources.map((s: any) => ({ url: s.url, title: s.title }))
    };

  } catch (error) {
    console.error(`[OpenAI Web Search] Exception:`, error);
    return { 
      cin: null, 
      confidence: "error", 
      rawResponse: error instanceof Error ? error.message : String(error),
      reason: "Exception during web search"
    };
  }
}

async function verifyCINWithCashfree(cin: string, cashfreeClientId: string, cashfreeClientSecret: string, cashfreePublicKey: string) {
  try {
    console.log(`[Cashfree] Starting verification for CIN: ${cin}`);
    
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${timestamp}.${cashfreeClientId}`;
    
    console.log(`[Cashfree] Preparing signature with timestamp: ${timestamp}`);
    
    const b64 = cashfreePublicKey.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, "");
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const publicKey = await crypto.subtle.importKey("spki", arr.buffer, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]);
    
    const encrypted = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, new TextEncoder().encode(message));
    const signature = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    
    console.log(`[Cashfree] Signature generated, length: ${signature.length}`);
    console.log(`[Cashfree] Making API request to https://api.cashfree.com/verification/cin`);
    
    const response = await fetch("https://api.cashfree.com/verification/cin", {
      method: "POST",
      headers: { "x-client-id": cashfreeClientId, "x-client-secret": cashfreeClientSecret, "x-cf-signature": `${timestamp}:${signature}`, "Content-Type": "application/json" },
      body: JSON.stringify({ cin }),
    });
    
    const responseBody = await response.json();
    
    console.log(`[Cashfree] Response received:`, {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });
    console.log(`[Cashfree] Response body:`, JSON.stringify(responseBody, null, 2));
    
    if (!response.ok) {
      console.error(`[Cashfree] ❌ API Error:`, responseBody);
      return {
        error: responseBody,
        status: response.status,
        errorMessage: responseBody.message || responseBody.error || 'Unknown error',
        errorType: 'api_error'
      };
    }
    
    console.log(`[Cashfree] ✅ Verification successful`);
    return responseBody;
    
  } catch (error) {
    console.error(`[Cashfree] ❌ Exception:`, error);
    return {
      error: error instanceof Error ? error.message : String(error),
      errorType: 'exception',
      errorStack: error instanceof Error ? error.stack : undefined
    };
  }
}

async function sendFacebookEvent(eventName: string, email: string, phone: string, fbp?: string, fbc?: string) {
  try {
    const pixelId = '921840036600612';
    const accessToken = 'EAAQgCWx87AYBOxl3EzRLN5jJ1cq0c0dHkKTZBhj3EqZBoY0vZCOCvA7Vo2dZAI2Hn7IxDp2E62tTCMnfMmaTXvkOlSaRZCj4XsqwCJWiUTsVR4HQ19cJCY8Pq12lKq0v4gJlNGwZBVWk6l0uvOnWJbXZBxGE2bvWs87EzZBrMKpQ96ZAWz8mZABCAD9mq3LgnVRiZCfD98ZC';
    const eventData = {
      data: [{ event_name: eventName, event_time: Math.floor(Date.now() / 1000), action_source: 'website',
        user_data: { em: [await sha256Hex(email.toLowerCase().trim())], ph: [await sha256Hex(phone.replace(/\D/g, ''))], ...(fbp && { fbp }), ...(fbc && { fbc }) }}]
    };
    await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventData)
    });
  } catch (error) {
    console.error(`[Facebook] Error:`, error);
  }
}

serve(async (req) => {
  console.log('=== validate-and-submit: Request received ===');
  
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { companyName, founderName, founderBackground, idea, revenueModel, usp, email, phone, fbp, fbc, cinOverride } = await req.json();
    
    console.log('Parsed request data:', { 
      companyName, 
      founderName, 
      email, 
      phone: phone?.substring(0, 3) + 'XXX' // Partial masking for privacy
    });
    
    if (!companyName || !founderName || !email || !phone) {
      console.error('❌ Missing required fields');
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    await supabase.from('submissions').insert({ company_name: companyName, cin: cinOverride || '', founder_name: founderName, founder_background: founderBackground, idea, revenue_model: revenueModel, usp, email, phone });
    console.log('✅ Archived to submissions table');
    
    // Phase 4: Manual CIN Override Logic
    let cin: string | null = null;
    let confidence: string;
    let rawResponse: string;
    let reason: string | undefined;
    let sources: any[] | undefined; // Declare sources at function scope
    
    if (cinOverride && /^[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(cinOverride)) {
      console.log(`✅ Using manually provided CIN: ${cinOverride}`);
      cin = cinOverride;
      confidence = "manual";
      rawResponse = "Provided by user";
      reason = "Manual CIN provided by user";
      sources = undefined; // No sources for manual entry
    } else {
      // Run AI search with OpenAI
      const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openaiApiKey) {
        console.error('❌ OPENAI_API_KEY not configured');
        return new Response(JSON.stringify({ error: "AI service not configured" }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      console.log('🔍 Starting OpenAI CIN search...');
      const aiResult = await findCINWithAI(companyName, founderName, openaiApiKey);
      cin = aiResult.cin;
      confidence = aiResult.confidence;
      rawResponse = aiResult.rawResponse;
      reason = aiResult.reason;
      sources = aiResult.sources; // Extract sources for storage
      
      // Store sources for later use
      if (sources && sources.length > 0) {
        console.log(`[Main] AI consulted ${sources.length} web sources`);
      }
    }
    
    console.log('AI Search Result:', { cin, confidence, companyName, reason, sourcesCount: sources?.length || 0 });
    
    // Phase 3: Improved "CIN Not Found" Handling with Manual Review Path
    if (!cin) {
      console.log(`❌ No CIN found - routing to impure_leads for manual review`);
      console.log(`Reason: ${reason || 'Unknown'}`);
      console.log(`Raw AI Response: ${rawResponse}`);
      
      const { data } = await supabase.from('impure_leads').insert({ 
        company_name: companyName, 
        founder_name: founderName, 
        founder_background: founderBackground, 
        idea, 
        revenue_model: revenueModel, 
        usp, 
        email, 
        phone, 
        cin_found_by_ai: null, 
        ai_search_confidence: confidence, 
        ai_search_failed: true, 
        rejection_reason: `CIN not found. Reason: ${reason || 'AI returned no CIN'}`,
        verification_error_details: { 
          ai_confidence: confidence, 
          raw_response: rawResponse,
          search_reason: reason,
          web_search_sources: sources || [], // Store URLs consulted
          manual_review_required: true  // Flag for manual review queue
        }
      }).select().single();
      
      console.log(`Stored in impure_leads with ID: ${data.id} (flagged for manual review)`);
      await sendFacebookEvent('Lead', email, phone, fbp, fbc);
      
      return new Response(JSON.stringify({ 
        ok: true, 
        leadType: 'impure', 
        leadId: data.id,
        reason: 'CIN not found - pending manual review',
        message: 'Thank you! Your submission is under review.'
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    // Test Cashfree credentials with known valid CIN
    console.log('🧪 Testing Cashfree API credentials...');
    const testResult = await verifyCINWithCashfree(
      'U72900KA2020PTC123456', // Test CIN
      Deno.env.get('CASHFREE_CLIENT_ID')!,
      Deno.env.get('CASHFREE_CLIENT_SECRET')!,
      Deno.env.get('CASHFREE_PUBLIC_KEY_PEM')!
    );
    console.log('Cashfree Test Result:', JSON.stringify(testResult, null, 2));
    
    console.log('🔍 Calling Cashfree API for actual CIN:', cin);
    console.log('Using credentials:', {
      clientId: Deno.env.get('CASHFREE_CLIENT_ID')?.substring(0, 5) + '...',
      hasSecret: !!Deno.env.get('CASHFREE_CLIENT_SECRET'),
      hasPublicKey: !!Deno.env.get('CASHFREE_PUBLIC_KEY_PEM')
    });
    
    const verificationResult = await verifyCINWithCashfree(cin, Deno.env.get('CASHFREE_CLIENT_ID')!, Deno.env.get('CASHFREE_CLIENT_SECRET')!, Deno.env.get('CASHFREE_PUBLIC_KEY_PEM')!);
    
    console.log('Cashfree Response:', JSON.stringify(verificationResult, null, 2));
    
    if (verificationResult.error) {
      console.error('❌ Cashfree Error Details:', {
        error: verificationResult.error,
        status: verificationResult.status,
        errorType: verificationResult.errorType
      });
      
      // Store detailed error in database
      const { data } = await supabase.from('impure_leads').insert({ 
        company_name: companyName, 
        founder_name: founderName, 
        founder_background: founderBackground, 
        idea, 
        revenue_model: revenueModel, 
        usp, 
        email, 
        phone, 
        cin_found_by_ai: cin, 
        ai_search_confidence: confidence, 
        rejection_reason: `Cashfree API error: ${verificationResult.errorMessage || JSON.stringify(verificationResult.error)}`,
        verification_error_details: verificationResult.error // Store full error object in new column
      }).select().single();
      
      console.log('Stored in impure_leads with ID:', data.id);
      await sendFacebookEvent('lead_A', email, phone, fbp, fbc);
      return new Response(JSON.stringify({ ok: true, leadType: 'impure', leadId: data.id, reason: 'Verification failed' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const companyData = verificationResult.company_details || verificationResult;
    const verifiedCompanyName = companyData.company_name || "";
    const companyStatus = companyData.company_status || "";
    const directorDetails = companyData.directors || [];
    if (companyStatus.toLowerCase() !== "active") {
      const { data } = await supabase.from('impure_leads').insert({ company_name: companyName, founder_name: founderName, founder_background: founderBackground, idea, revenue_model: revenueModel, usp, email, phone, cin_found_by_ai: cin, ai_search_confidence: confidence, verified_company_name: verifiedCompanyName, company_status: companyStatus, director_details: directorDetails, rejection_reason: `Company not active (${companyStatus})` }).select().single();
      await sendFacebookEvent('lead_A', email, phone, fbp, fbc);
      return new Response(JSON.stringify({ ok: true, leadType: 'impure', leadId: data.id, reason: 'Company not active' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const nameSimilarity = calculateSimilarity(companyName, verifiedCompanyName);
    const { matched: directorMatch, matchedDirectorName } = isFounderInDirectors(founderName, directorDetails);
    
    console.log('Company Match Check:', {
      input: companyName,
      verified: verifiedCompanyName,
      similarity: nameSimilarity.toFixed(2),
      threshold: 0.80
    });
    
    console.log('Director Match Check:', {
      founderInput: founderName,
      directors: directorDetails?.map(d => d.name || d.director_name),
      matched: directorMatch,
      matchedName: matchedDirectorName
    });
    
    const isPure = nameSimilarity >= 0.80 && directorMatch;
    
    console.log('=== Routing Decision ===', {
      leadType: isPure ? 'PURE ✅' : 'IMPURE ❌',
      companySimilarity: nameSimilarity.toFixed(2),
      directorMatched: directorMatch,
      companyStatus,
      reason: isPure ? 'All checks passed' : 'Match quality insufficient'
    });
    
    if (isPure) {
      const { data } = await supabase.from('pure_conversions').insert({ company_name: companyName, founder_name: founderName, founder_background: founderBackground, idea, revenue_model: revenueModel, usp, email, phone, cin_found_by_ai: cin, ai_search_confidence: confidence, verified_company_name: verifiedCompanyName, verification_id: verificationResult.verification_id, reference_id: verificationResult.reference_id, company_status: companyStatus, cin_status: companyData.cin_status, registration_number: companyData.registration_number, incorporation_date: companyData.date_of_incorporation, incorporation_country: companyData.country_of_incorporation, director_details: directorDetails, company_name_match_score: nameSimilarity, director_name_match: directorMatch, matched_director_name: matchedDirectorName }).select().single();
      console.log('✅ Stored in pure_conversions with ID:', data.id);
      await sendFacebookEvent('CompleteRegistration', email, phone, fbp, fbc);
      return new Response(JSON.stringify({ ok: true, accepted: true, leadType: 'pure', leadId: data.id, verifiedCompanyName }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } else {
      const rejectionReasons = [];
      if (nameSimilarity < 0.80) rejectionReasons.push(`Name similarity too low (${(nameSimilarity * 100).toFixed(0)}% < 80%)`);
      if (!directorMatch) rejectionReasons.push("Founder not found in director list");
      const { data } = await supabase.from('impure_leads').insert({ company_name: companyName, founder_name: founderName, founder_background: founderBackground, idea, revenue_model: revenueModel, usp, email, phone, cin_found_by_ai: cin, ai_search_confidence: confidence, verified_company_name: verifiedCompanyName, verification_id: verificationResult.verification_id, company_status: companyStatus, director_details: directorDetails, rejection_reason: rejectionReasons.join("; "), company_name_match_score: nameSimilarity, director_name_match: directorMatch }).select().single();
      console.log('❌ Stored in impure_leads with ID:', data.id, '| Reasons:', rejectionReasons.join("; "));
      await sendFacebookEvent('lead_A', email, phone, fbp, fbc);
      return new Response(JSON.stringify({ ok: true, leadType: 'impure', leadId: data.id, reason: rejectionReasons.join("; ") }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
