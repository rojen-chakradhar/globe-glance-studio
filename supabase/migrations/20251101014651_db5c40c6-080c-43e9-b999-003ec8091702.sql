-- Make guide_id nullable in bookings table to allow custom trip requests
ALTER TABLE public.bookings ALTER COLUMN guide_id DROP NOT NULL;

-- Make tour_id nullable as well for consistency
ALTER TABLE public.bookings ALTER COLUMN tour_id DROP NOT NULL;