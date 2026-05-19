-- Purchase Agreements (legal consent tracking)
-- Run in Supabase SQL Editor after rbac-setup.sql

CREATE TABLE IF NOT EXISTS public.purchase_agreements (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id              TEXT NOT NULL,
  agreed_terms_and_policy BOOLEAN NOT NULL DEFAULT false,
  agreed_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.purchase_agreements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own agreements"  ON public.purchase_agreements;
DROP POLICY IF EXISTS "Users can view own agreements"   ON public.purchase_agreements;
DROP POLICY IF EXISTS "Admins can view all agreements"  ON public.purchase_agreements;

CREATE POLICY "Users can insert own agreements"
  ON public.purchase_agreements FOR INSERT
  WITH CHECK (auth.uid() = user_id AND agreed_terms_and_policy = true);

CREATE POLICY "Users can view own agreements"
  ON public.purchase_agreements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all agreements"
  ON public.purchase_agreements FOR SELECT
  USING (public.get_my_role() IN ('admin', 'superadmin'));

CREATE INDEX IF NOT EXISTS idx_purchase_agreements_user_id
  ON public.purchase_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_agreements_package_id
  ON public.purchase_agreements(package_id);
