-- ============================================================
-- email-verification-setup.sql
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Add email_verified column to users (default false — new users must verify email)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- 1b. Fix default if column already existed with DEFAULT true
ALTER TABLE public.users ALTER COLUMN email_verified SET DEFAULT false;

-- 2. Mark ALL existing users as verified (they pre-existed this feature)
UPDATE public.users SET email_verified = true WHERE email_verified IS NULL OR email_verified = true;

-- 2b. Patch the trigger to explicitly set email_verified = false for new registrations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, phone, address, email, role, kyc_status, email_verified)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address',
    NEW.email,
    'user',
    'not_submitted',
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
