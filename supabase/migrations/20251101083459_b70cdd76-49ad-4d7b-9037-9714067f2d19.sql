-- Create guide token wallet and transactions for commission deductions (retry without IF NOT EXISTS)
-- 1) guide_tokens: one wallet per guide
CREATE TABLE IF NOT EXISTS public.guide_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  balance numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_guide_tokens_updated_at ON public.guide_tokens;
CREATE TRIGGER trg_guide_tokens_updated_at
BEFORE UPDATE ON public.guide_tokens
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS and policies
ALTER TABLE public.guide_tokens ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DROP POLICY IF EXISTS "Guides can view their own token balance" ON public.guide_tokens;
DROP POLICY IF EXISTS "Guides can create their own wallet" ON public.guide_tokens;

CREATE POLICY "Guides can view their own token balance"
ON public.guide_tokens
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Guides can create their own wallet"
ON public.guide_tokens
FOR INSERT
WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'guide'));

-- No UPDATE/DELETE policies to prevent client-side balance changes

CREATE INDEX IF NOT EXISTS idx_guide_tokens_user ON public.guide_tokens(user_id);

-- 2) token_transactions: audit log of debits/credits
CREATE TABLE IF NOT EXISTS public.token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  booking_id uuid NULL,
  amount numeric NOT NULL,
  direction text NOT NULL CHECK (direction IN ('debit','credit')),
  reason text NOT NULL,
  metadata jsonb NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guides can view their own token transactions" ON public.token_transactions;
CREATE POLICY "Guides can view their own token transactions"
ON public.token_transactions
FOR SELECT
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_token_tx_user ON public.token_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_token_tx_booking ON public.token_transactions(booking_id);
