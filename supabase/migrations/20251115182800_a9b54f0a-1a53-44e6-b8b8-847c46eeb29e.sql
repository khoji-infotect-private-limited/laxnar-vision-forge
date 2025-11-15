-- Add columns to store full Cashfree API response data
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS verification_id TEXT,
ADD COLUMN IF NOT EXISTS reference_id TEXT,
ADD COLUMN IF NOT EXISTS registration_number TEXT,
ADD COLUMN IF NOT EXISTS incorporation_date DATE,
ADD COLUMN IF NOT EXISTS cin_status TEXT,
ADD COLUMN IF NOT EXISTS verified_email TEXT,
ADD COLUMN IF NOT EXISTS incorporation_country TEXT,
ADD COLUMN IF NOT EXISTS director_details JSONB;

-- Make phone mandatory
ALTER TABLE public.submissions 
ALTER COLUMN phone SET NOT NULL,
ALTER COLUMN phone SET DEFAULT '';

-- Add comment for director_details column
COMMENT ON COLUMN public.submissions.director_details IS 'Array of director objects with dob, designation, address, din, and name';