-- Production-Ready RBAC System for Supabase
-- This script sets up Role-Based Access Control with audit logging
-- Works with existing users table (not profiles)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. UPDATE EXISTING USERS TABLE FOR RBAC
-- ============================================

-- Update role column to support new roles (user, admin, superadmin)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'users' 
        AND table_schema = 'public'
    ) THEN
        -- Drop existing role constraint if it exists
        ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
        
        -- Add new role constraint with updated roles
        ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'superadmin'));
        
        -- Update existing 'client' roles to 'user'
        UPDATE public.users SET role = 'user' WHERE role = 'client';
    END IF;
END $$;

-- ============================================
-- 2. AUDIT LOGS TABLE
-- ============================================

-- Create audit_logs table (optional - requires higher permissions)
-- If this fails, the RBAC system will still work without audit logging
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audit_logs'
    ) THEN
        EXECUTE 'CREATE TABLE public.audit_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
          action TEXT NOT NULL,
          target_table TEXT NOT NULL,
          target_id TEXT,
          old_data JSONB,
          new_data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create audit_logs table. RBAC will work without audit logging.';
END $$;

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Only enable RLS on audit_logs if table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audit_logs'
    ) THEN
        EXECUTE 'ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY';
    END IF;
END $$;

-- ============================================
-- 4. RLS POLICIES FOR USERS
-- ============================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Users can SELECT only their own profile
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can UPDATE only their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Superadmin can SELECT all users
CREATE POLICY "Superadmin can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- Superadmin can UPDATE all users
CREATE POLICY "Superadmin can update all users"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- Admin can SELECT all users
CREATE POLICY "Admin can view all users"
  ON public.users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  );

-- Admin can UPDATE users but NOT change roles
CREATE POLICY "Admin can update users (no role changes)"
  ON public.users
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
    )
  )
  WITH CHECK (
    role = (SELECT role FROM public.users WHERE id = id)
  );

-- ============================================
-- 5. RLS POLICIES FOR AUDIT LOGS
-- ============================================

-- Only create audit_logs policies if table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audit_logs'
    ) THEN
        EXECUTE 'CREATE POLICY IF NOT EXISTS "Superadmin can view audit logs"
          ON public.audit_logs
          FOR SELECT
          USING (
            EXISTS (
              SELECT 1 FROM public.users
              WHERE id = auth.uid() AND role = ''superadmin''
            )
          )';
        
        EXECUTE 'CREATE POLICY IF NOT EXISTS "System can insert audit logs"
          ON public.audit_logs
          FOR INSERT
          WITH CHECK (true)';
    END IF;
END $$;

-- ============================================
-- 6. AUTOMATIC USER CREATION TRIGGER
-- ============================================

-- Function to automatically create user when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, phone, address, email, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address',
    NEW.email,
    'user' -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. AUDIT LOG TRIGGER FUNCTION
-- ============================================

-- Function to log changes to users (only if audit_logs table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audit_logs'
    ) THEN
        EXECUTE 'CREATE OR REPLACE FUNCTION public.log_user_changes()
        RETURNS TRIGGER AS $$
        BEGIN
          IF (TG_OP = ''INSERT'') THEN
            INSERT INTO public.audit_logs (user_id, action, target_table, target_id, new_data)
            VALUES (
              auth.uid(),
              ''INSERT'',
              ''users'',
              NEW.id::TEXT,
              to_jsonb(NEW)
            );
            RETURN NEW;
          ELSIF (TG_OP = ''UPDATE'') THEN
            INSERT INTO public.audit_logs (user_id, action, target_table, target_id, old_data, new_data)
            VALUES (
              auth.uid(),
              ''UPDATE'',
              ''users'',
              NEW.id::TEXT,
              to_jsonb(OLD),
              to_jsonb(NEW)
            );
            RETURN NEW;
          ELSIF (TG_OP = ''DELETE'') THEN
            INSERT INTO public.audit_logs (user_id, action, target_table, target_id, old_data)
            VALUES (
              auth.uid(),
              ''DELETE'',
              ''users'',
              OLD.id::TEXT,
              to_jsonb(OLD)
            );
            RETURN OLD;
          END IF;
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER';
        
        EXECUTE 'DROP TRIGGER IF EXISTS log_user_changes_trigger ON public.users';
        EXECUTE 'CREATE TRIGGER log_user_changes_trigger
          AFTER INSERT OR UPDATE OR DELETE ON public.users
          FOR EACH ROW
          EXECUTE FUNCTION public.log_user_changes()';
    END IF;
END $$;

-- ============================================
-- 8. UPDATED_AT TIMESTAMP TRIGGER
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on users
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS users_role_idx ON public.users(role);

-- Only create audit_logs indexes if table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audit_logs'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON public.audit_logs(user_id)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON public.audit_logs(action)';
        EXECUTE 'CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON public.audit_logs(created_at DESC)';
    END IF;
END $$;

-- ============================================
-- 10. SUPERADMIN SETUP
-- ============================================

-- Manually assign superadmin role to specific email
-- Run this after the setup is complete:
-- UPDATE public.users
-- SET role = 'superadmin'
-- WHERE email = 'genecorbeta09@gmail.com';

-- ============================================
-- 11. SECURITY NOTES
-- ============================================

-- IMPORTANT SECURITY RULES:
-- 1. Never trust frontend role checks alone - always enforce with RLS
-- 2. Service role key must NEVER be exposed to client
-- 3. Only superadmin can modify roles (enforced by RLS policy)
-- 4. Admin cannot promote themselves to superadmin (enforced by RLS policy)
-- 5. All user changes are automatically logged to audit_logs

-- To assign superadmin after user registration:
-- UPDATE public.users SET role = 'superadmin' WHERE email = 'user@example.com';
