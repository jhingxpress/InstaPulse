-- ============================================================
-- support-messages-delete-patch.sql
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- Allows superadmin to delete individual support messages
-- ============================================================

DROP POLICY IF EXISTS "Superadmin can delete support messages" ON public.support_messages;
CREATE POLICY "Superadmin can delete support messages"
  ON public.support_messages FOR DELETE
  USING (public.get_my_role() = 'superadmin');
