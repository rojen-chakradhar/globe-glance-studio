-- Add new fields to kyc_verifications table
ALTER TABLE public.kyc_verifications
ADD COLUMN IF NOT EXISTS driver_license_photo_url text,
ADD COLUMN IF NOT EXISTS personality_type text,
ADD COLUMN IF NOT EXISTS why_choose_you text;

-- Add check constraint for personality type
ALTER TABLE public.kyc_verifications
ADD CONSTRAINT check_personality_type 
CHECK (personality_type IN ('extrovert', 'introvert', 'omnivert') OR personality_type IS NULL);