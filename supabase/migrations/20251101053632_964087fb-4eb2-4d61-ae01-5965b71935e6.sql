-- Create storage buckets for KYC documents
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('kyc-documents', 'kyc-documents', false),
  ('kyc-photos', 'kyc-photos', false);

-- Create KYC verifications table
CREATE TABLE public.kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_profile_id UUID NOT NULL REFERENCES guide_profiles(id) ON DELETE CASCADE,
  
  -- Personal Information
  full_government_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  permanent_address TEXT NOT NULL,
  
  -- Documents
  citizenship_photo_url TEXT,
  nid_photo_url TEXT,
  live_photo_url TEXT,
  
  -- Professional Information
  qualification TEXT NOT NULL,
  profession TEXT NOT NULL,
  languages TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  experience_description TEXT NOT NULL,
  services_provided TEXT NOT NULL,
  
  -- Personal Details
  bad_habits TEXT,
  hobbies TEXT,
  dreams TEXT,
  
  -- Emergency Contact
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_relation TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  
  -- Verification Status
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verification_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

-- Guides can insert their own KYC data
CREATE POLICY "Guides can insert their own KYC"
ON public.kyc_verifications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Guides can view their own KYC data
CREATE POLICY "Guides can view their own KYC"
ON public.kyc_verifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Guides can update their own pending KYC data
CREATE POLICY "Guides can update their pending KYC"
ON public.kyc_verifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND verification_status = 'pending');

-- Storage policies for KYC documents
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own KYC documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for KYC photos
CREATE POLICY "Users can upload their own KYC photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own KYC photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Trigger to update updated_at
CREATE TRIGGER update_kyc_verifications_updated_at
BEFORE UPDATE ON public.kyc_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();