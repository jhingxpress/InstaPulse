-- ============================================================
-- email-verification-setup.sql
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Add email_verified column to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- 2. Mark ALL existing users as verified (they pre-existed this feature)
UPDATE public.users SET email_verified = true WHERE email_verified = false;

-- 3. Create email_verifications table
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ev_token   ON public.email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_ev_user_id ON public.email_verifications(user_id);

-- 4. Enable RLS — only server-side service role can access
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "No public access to email_verifications" ON public.email_verifications;
CREATE POLICY "No public access to email_verifications" ON public.email_verifications
  FOR ALL USING (false);
