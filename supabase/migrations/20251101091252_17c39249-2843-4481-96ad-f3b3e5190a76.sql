-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL,
  tourist_id UUID NOT NULL,
  guide_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(booking_id)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view reviews"
ON public.reviews
FOR SELECT
USING (true);

CREATE POLICY "Tourists can create reviews for their completed bookings"
ON public.reviews
FOR INSERT
WITH CHECK (
  auth.uid() = tourist_id 
  AND EXISTS (
    SELECT 1 FROM bookings 
    WHERE bookings.id = booking_id 
    AND bookings.tourist_id = auth.uid() 
    AND bookings.status = 'completed'
  )
);

CREATE POLICY "Tourists can update their own reviews"
ON public.reviews
FOR UPDATE
USING (auth.uid() = tourist_id);

-- Function to update guide ratings
CREATE OR REPLACE FUNCTION public.update_guide_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE guide_profiles
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE guide_id = NEW.guide_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE guide_id = NEW.guide_id
    ),
    updated_at = now()
  WHERE user_id = NEW.guide_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update guide ratings after review insert/update
CREATE TRIGGER update_guide_rating_after_review
AFTER INSERT OR UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_guide_rating();

-- Add updated_at trigger for reviews
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();