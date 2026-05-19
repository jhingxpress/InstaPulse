-- Fix Missing Users Script
-- Run this to repair any auth.users that are missing from public.users
-- Safe to run multiple times

-- Insert missing users from auth.users into public.users
INSERT INTO public.users (id, email, full_name, phone, address, role, kyc_status)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  COALESCE(au.raw_user_meta_data->>'phone', ''),
  COALESCE(au.raw_user_meta_data->>'address', ''),
  'user',
  'not_submitted'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- Verify the fix
SELECT 
  COUNT(*) as auth_users_count
FROM auth.users;

SELECT 
  COUNT(*) as public_users_count
FROM public.users;
