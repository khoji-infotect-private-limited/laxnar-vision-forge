-- Add column to store detailed verification error information
ALTER TABLE impure_leads 
ADD COLUMN IF NOT EXISTS verification_error_details JSONB;