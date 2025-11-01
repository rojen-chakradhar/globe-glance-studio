-- Create tours table for guides to list their tour offerings
CREATE TABLE public.tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  destination TEXT NOT NULL,
  duration_hours INTEGER NOT NULL,
  price_per_person NUMERIC NOT NULL,
  max_group_size INTEGER NOT NULL DEFAULT 10,
  languages TEXT[] NOT NULL DEFAULT ARRAY['English']::TEXT[],
  included_services TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT tours_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES public.guide_profiles(user_id) ON DELETE CASCADE,
  CONSTRAINT tours_status_check CHECK (status IN ('active', 'inactive'))
);

-- Enable RLS on tours table
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active tours
CREATE POLICY "Active tours are viewable by everyone"
ON public.tours
FOR SELECT
USING (status = 'active');

-- Policy: Guides can insert their own tours
CREATE POLICY "Guides can insert their own tours"
ON public.tours
FOR INSERT
WITH CHECK (auth.uid() = guide_id AND has_role(auth.uid(), 'guide'::app_role));

-- Policy: Guides can update their own tours
CREATE POLICY "Guides can update their own tours"
ON public.tours
FOR UPDATE
USING (auth.uid() = guide_id);

-- Policy: Guides can delete their own tours
CREATE POLICY "Guides can delete their own tours"
ON public.tours
FOR DELETE
USING (auth.uid() = guide_id);

-- Add trigger for updated_at
CREATE TRIGGER update_tours_updated_at
BEFORE UPDATE ON public.tours
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add tour_id to bookings table (nullable to maintain existing bookings)
ALTER TABLE public.bookings
ADD COLUMN tour_id UUID REFERENCES public.tours(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_tours_guide_id ON public.tours(guide_id);
CREATE INDEX idx_tours_status ON public.tours(status);
CREATE INDEX idx_bookings_tour_id ON public.bookings(tour_id);