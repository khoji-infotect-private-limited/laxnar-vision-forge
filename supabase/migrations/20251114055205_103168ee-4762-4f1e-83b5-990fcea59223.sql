-- Create submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  idea_description TEXT NOT NULL,
  traction TEXT,
  whatsapp_number TEXT NOT NULL,
  pitch_deck_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert submissions (public form)
CREATE POLICY "Anyone can submit" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policy to prevent public reads (only admins should see submissions)
CREATE POLICY "No public reads" 
ON public.submissions 
FOR SELECT 
USING (false);

-- Create storage bucket for pitch decks
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'pitch-decks', 
  'pitch-decks', 
  false,
  10485760,
  ARRAY['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
);

-- Storage policies for pitch deck uploads
CREATE POLICY "Anyone can upload pitch decks" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'pitch-decks');

CREATE POLICY "No public access to pitch decks" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'pitch-decks' AND false);