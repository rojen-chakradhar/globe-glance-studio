-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- Create tour_requests table for tourist buddy requests
CREATE TABLE public.tour_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tourist_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  requirements TEXT NOT NULL,
  offered_price NUMERIC NOT NULL,
  status request_status NOT NULL DEFAULT 'open',
  selected_guide_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tourist_location_lat NUMERIC,
  tourist_location_lng NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guide_interests table for guides showing interest
CREATE TABLE public.guide_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.tour_requests(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  counter_offer_price NUMERIC NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(request_id, guide_id)
);

-- Enable RLS
ALTER TABLE public.tour_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_interests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tour_requests
CREATE POLICY "Tourists can create their own requests"
  ON public.tour_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = tourist_id);

CREATE POLICY "Tourists can view their own requests"
  ON public.tour_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = tourist_id);

CREATE POLICY "Guides can view open requests"
  ON public.tour_requests FOR SELECT
  TO authenticated
  USING (status = 'open' AND has_role(auth.uid(), 'guide'));

CREATE POLICY "Tourists can update their own requests"
  ON public.tour_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = tourist_id);

-- RLS Policies for guide_interests
CREATE POLICY "Guides can create interests"
  ON public.guide_interests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = guide_id AND has_role(auth.uid(), 'guide'));

CREATE POLICY "Guides can view their own interests"
  ON public.guide_interests FOR SELECT
  TO authenticated
  USING (auth.uid() = guide_id);

CREATE POLICY "Tourists can view interests on their requests"
  ON public.guide_interests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tour_requests
      WHERE tour_requests.id = guide_interests.request_id
      AND tour_requests.tourist_id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_tour_requests_updated_at
  BEFORE UPDATE ON public.tour_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.tour_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guide_interests;