-- Cleanup Script: Remove conflicting profiles table and triggers
-- This script ensures only public.users table is used (from rbac-setup.sql)

-- ============================================
-- 1. DROP PROFILES TABLE (if exists)
-- ============================================

DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- 2. DROP OLD TRIGGER (from profiles-setup.sql)
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Only drop trigger on profiles if table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) THEN
        DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
    END IF;
END $$;

-- ============================================
-- 3. DROP OLD FUNCTION (from profiles-setup.sql)
-- ============================================

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ============================================
-- 4. VERIFICATION
-- ============================================

-- Verify profiles table is gone
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) THEN
        RAISE NOTICE 'WARNING: profiles table still exists';
    ELSE
        RAISE NOTICE 'SUCCESS: profiles table has been removed';
    END IF;
END $$;

-- Verify users table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
    ) THEN
        RAISE NOTICE 'SUCCESS: users table exists';
    ELSE
        RAISE NOTICE 'WARNING: users table does not exist - run rbac-setup.sql';
    END IF;
END $$;
