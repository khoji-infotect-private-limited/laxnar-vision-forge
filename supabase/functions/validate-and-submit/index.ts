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

async function findCINWithAI(companyName: string, founderName: string, lovableApiKey: string) {
  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: "You are a helpful assistant that searches for Indian company CIN numbers." },
          { role: "user", content: `Find the 21-character CIN for: ${companyName}, Founder: ${founderName}. Format: [A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}` }],
      }),
    });
    if (!response.ok) return { cin: null, confidence: "error", rawResponse: `API error: ${response.status}` };
    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "";
    const match = aiResponse.match(/[A-Z][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}/);
    return match ? { cin: match[0], confidence: "medium", rawResponse: aiResponse } : { cin: null, confidence: "not_found", rawResponse: aiResponse };
  } catch (error) {
    return { cin: null, confidence: "error", rawResponse: error instanceof Error ? error.message : String(error) };
  }
}

async function verifyCINWithCashfree(cin: string, cashfreeClientId: string, cashfreeClientSecret: string, cashfreePublicKey: string) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${timestamp}.${cashfreeClientId}`;
    const b64 = cashfreePublicKey.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, "");
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const publicKey = await crypto.subtle.importKey("spki", arr.buffer, { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]);
    const encrypted = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, new TextEncoder().encode(message));
    const signature = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    const response = await fetch("https://api.cashfree.com/verification/cin", {
      method: "POST",
      headers: { "x-client-id": cashfreeClientId, "x-client-secret": cashfreeClientSecret, "x-cf-signature": `${timestamp}:${signature}`, "Content-Type": "application/json" },
      body: JSON.stringify({ cin }),
    });
    return response.ok ? await response.json() : { error: await response.json(), status: response.status };
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) };
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
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { companyName, founderName, founderBackground, idea, revenueModel, usp, email, phone, fbp, fbc } = await req.json();
    if (!companyName || !founderName || !email || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    await supabase.from('submissions').insert({ company_name: companyName, cin: '', founder_name: founderName, founder_background: founderBackground, idea, revenue_model: revenueModel, usp, email, phone });
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) return new Response(JSON.stringify({ error: "AI service not configured" }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const { cin, confidence } = await findCINWithAI(companyName, founderName, lovableApiKey);
    if (!cin) {
      const { data } = await supabase.from('impure_leads').insert({ company_name: companyName, founder_name: founderName, founder_background: founderBackground, idea, revenue_model: revenueModel, usp, email, phone, cin_found_by_ai: null, ai_search_confidence: confidence, ai_search_failed: true, rejection_reason: "CIN not found by AI search" }).select().single();
      await sendFacebookEvent('lead_A', email, phone, fbp, fbc);
      return new Response(JSON.stringify({ ok: true, leadType: 'impure', leadId: data.id, reason: 'CIN not found' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const verificationResult = await verifyCINWithCashfree(cin, Deno.env.get('CASHFREE_CLIENT_ID')!, Deno.env.get('CASHFREE_CLIENT_SECRET')!, Deno.env.get('CASHFREE_PUBLIC_KEY_PEM')!);
    if (verificationResult.error) {
      const { data } = await supabase.from('impure_leads').insert({ company_name: companyName, founder_name: founderName, founder_background: founderBackground, idea, revenue_model: revenueModel, usp, email, phone, cin_found_by_ai: cin, ai_search_confidence: confidence, rejection_reason: "Cashfree verification failed" }).select().single();
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
    const isPure = nameSimilarity >= 0.80 && directorMatch;
    if (isPure) {
      const { data } = await supabase.from('pure_conversions').insert({ company_name: companyName, founder_name: founderName, founder_background: founderBackground, idea, revenue_model: revenueModel, usp, email, phone, cin_found_by_ai: cin, ai_search_confidence: confidence, verified_company_name: verifiedCompanyName, verification_id: verificationResult.verification_id, reference_id: verificationResult.reference_id, company_status: companyStatus, cin_status: companyData.cin_status, registration_number: companyData.registration_number, incorporation_date: companyData.date_of_incorporation, incorporation_country: companyData.country_of_incorporation, director_details: directorDetails, company_name_match_score: nameSimilarity, director_name_match: directorMatch, matched_director_name: matchedDirectorName }).select().single();
      await sendFacebookEvent('CompleteRegistration', email, phone, fbp, fbc);
      return new Response(JSON.stringify({ ok: true, accepted: true, leadType: 'pure', leadId: data.id, verifiedCompanyName }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } else {
      const rejectionReasons = [];
      if (nameSimilarity < 0.80) rejectionReasons.push(`Name similarity too low (${(nameSimilarity * 100).toFixed(0)}% < 80%)`);
      if (!directorMatch) rejectionReasons.push("Founder not found in director list");
      const { data } = await supabase.from('impure_leads').insert({ company_name: companyName, founder_name: founderName, founder_background: founderBackground, idea, revenue_model: revenueModel, usp, email, phone, cin_found_by_ai: cin, ai_search_confidence: confidence, verified_company_name: verifiedCompanyName, verification_id: verificationResult.verification_id, company_status: companyStatus, director_details: directorDetails, rejection_reason: rejectionReasons.join("; "), company_name_match_score: nameSimilarity, director_name_match: directorMatch }).select().single();
      await sendFacebookEvent('lead_A', email, phone, fbp, fbc);
      return new Response(JSON.stringify({ ok: true, leadType: 'impure', leadId: data.id, reason: rejectionReasons.join("; ") }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
