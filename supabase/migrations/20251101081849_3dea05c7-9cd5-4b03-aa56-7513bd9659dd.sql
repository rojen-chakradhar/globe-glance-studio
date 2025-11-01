-- Add duration_hours to tour_requests table
ALTER TABLE public.tour_requests
ADD COLUMN IF NOT EXISTS duration_hours integer NOT NULL DEFAULT 1;

-- Add comment to clarify the pricing change
COMMENT ON COLUMN tour_requests.offered_price IS 'Price offered per hour in NPR';
COMMENT ON COLUMN guide_interests.counter_offer_price IS 'Counter offer price per hour in NPR';

-- Update guide_profiles hourly_rate comment
COMMENT ON COLUMN guide_profiles.hourly_rate IS 'Guide hourly rate in NPR';