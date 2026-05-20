-- ============================================================
-- email-verification-setup.sql
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- IMPORTANT: Before running, disable Supabase's built-in email
-- confirmations in: Auth → Providers → Email → "Confirm email" OFF
-- ============================================================

-- 1. Add email_verified column to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- 2. Mark ALL existing users as verified (they pre-existed this feature)
UPDATE public.users SET email_verified = true WHERE email_verified = false;

-- 3. Create verification tokens table
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evt_token   ON public.email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_evt_user_id ON public.email_verification_tokens(user_id);

-- 4. Enable RLS — only server-side service role can access tokens
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "No public access to tokens" ON public.email_verification_tokens;
CREATE POLICY "No public access to tokens" ON public.email_verification_tokens
  FOR ALL USING (false);
