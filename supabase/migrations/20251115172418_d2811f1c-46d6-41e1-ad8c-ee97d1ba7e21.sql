-- Add new fields to submissions table for CIN validation flow
ALTER TABLE public.submissions 
  ADD COLUMN company_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN cin TEXT NOT NULL DEFAULT '',
  ADD COLUMN founder_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN founder_background TEXT NOT NULL DEFAULT '',
  ADD COLUMN revenue_model TEXT NOT NULL DEFAULT '',
  ADD COLUMN usp TEXT NOT NULL DEFAULT '',
  ADD COLUMN phone TEXT;

-- Rename existing columns to match new schema
ALTER TABLE public.submissions 
  RENAME COLUMN name TO old_name;
ALTER TABLE public.submissions 
  RENAME COLUMN idea_description TO idea;
ALTER TABLE public.submissions 
  RENAME COLUMN whatsapp_number TO old_whatsapp;
ALTER TABLE public.submissions 
  RENAME COLUMN traction TO old_traction;

-- Drop old columns that are no longer needed
ALTER TABLE public.submissions 
  DROP COLUMN old_name,
  DROP COLUMN old_whatsapp,
  DROP COLUMN old_traction,
  DROP COLUMN pitch_deck_url;

-- Add company verification status
ALTER TABLE public.submissions
  ADD COLUMN company_status TEXT,
  ADD COLUMN verified_company_name TEXT;

-- Create index on CIN for faster lookups
CREATE INDEX idx_submissions_cin ON public.submissions(cin);