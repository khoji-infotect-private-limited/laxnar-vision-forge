-- Create pure_conversions table for verified high-quality leads
CREATE TABLE public.pure_conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- User Input Fields
  company_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  founder_background TEXT NOT NULL,
  idea TEXT NOT NULL,
  revenue_model TEXT NOT NULL,
  usp TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- AI Discovery Fields
  cin_found_by_ai TEXT NOT NULL,
  ai_search_confidence TEXT,
  
  -- Cashfree Verification Fields
  verified_company_name TEXT NOT NULL,
  verification_id TEXT,
  reference_id TEXT,
  company_status TEXT,
  cin_status TEXT,
  registration_number TEXT,
  incorporation_date DATE,
  incorporation_country TEXT,
  director_details JSONB,
  
  -- Match Validation
  company_name_match_score FLOAT,
  director_name_match BOOLEAN,
  matched_director_name TEXT,
  
  -- Meta Tracking
  fb_event_id TEXT,
  conversion_value NUMERIC DEFAULT 100
);

-- Create impure_leads table for unverified or mismatched leads
CREATE TABLE public.impure_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- User Input Fields
  company_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  founder_background TEXT NOT NULL,
  idea TEXT NOT NULL,
  revenue_model TEXT NOT NULL,
  usp TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- AI Attempt Fields
  cin_found_by_ai TEXT,
  ai_search_confidence TEXT,
  ai_search_failed BOOLEAN DEFAULT FALSE,
  
  -- Verification Attempt Fields
  verified_company_name TEXT,
  verification_id TEXT,
  company_status TEXT,
  director_details JSONB,
  
  -- Why Impure
  rejection_reason TEXT NOT NULL,
  company_name_match_score FLOAT,
  director_name_match BOOLEAN DEFAULT FALSE,
  
  -- Meta Tracking
  fb_event_id TEXT,
  lead_score INTEGER DEFAULT 50
);

-- Enable Row Level Security
ALTER TABLE public.pure_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impure_leads ENABLE ROW LEVEL SECURITY;

-- Create policies (no public read access, insert only from backend)
CREATE POLICY "No public reads on pure_conversions" 
ON public.pure_conversions 
FOR SELECT 
USING (false);

CREATE POLICY "No public reads on impure_leads" 
ON public.impure_leads 
FOR SELECT 
USING (false);

-- Create indexes for performance
CREATE INDEX idx_pure_conversions_created_at ON public.pure_conversions(created_at DESC);
CREATE INDEX idx_pure_conversions_email ON public.pure_conversions(email);
CREATE INDEX idx_impure_leads_created_at ON public.impure_leads(created_at DESC);
CREATE INDEX idx_impure_leads_email ON public.impure_leads(email);