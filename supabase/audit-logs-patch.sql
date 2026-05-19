-- ============================================================
-- Audit Logs Patch
-- Run this in Supabase SQL Editor to enable:
--   1. Superadmin can DELETE audit logs
--   2. Support tickets fix: allow admin SELECT on all tickets
-- ============================================================

-- 1. Allow superadmin to delete audit logs
DROP POLICY IF EXISTS "Superadmin can delete audit logs" ON public.audit_logs;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audit_logs') THEN
    EXECUTE $pol$
      CREATE POLICY "Superadmin can delete audit logs"
        ON public.audit_logs FOR DELETE
        USING (public.get_my_role() = 'superadmin')
    $pol$;
  END IF;
END $$;

-- 2. Fix support_tickets: ensure admins can SELECT all tickets
DROP POLICY IF EXISTS "Admins view all tickets" ON public.support_tickets;
CREATE POLICY "Admins view all tickets"
  ON public.support_tickets FOR SELECT
  USING (public.get_my_role() IN ('admin', 'superadmin'));

-- 3. Fix support_messages: ensure admins can SELECT all messages
DROP POLICY IF EXISTS "Admins view all messages" ON public.support_messages;
CREATE POLICY "Admins view all messages"
  ON public.support_messages FOR SELECT
  USING (public.get_my_role() IN ('admin', 'superadmin'));

-- 4. Ensure unread_admin and unread_user columns exist on support_tickets
ALTER TABLE public.support_tickets
  ADD COLUMN IF NOT EXISTS unread_admin INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unread_user  INTEGER DEFAULT 0;

DO $$
BEGIN
  RAISE NOTICE 'audit-logs-patch.sql complete.';
END $$;
