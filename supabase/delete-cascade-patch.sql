-- ============================================================
-- delete-cascade-patch.sql
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- Fixes FK cascade issues and adds superadmin delete capabilities
-- ============================================================

-- ============================================================
-- 1. FIX FK: payments.user_id → ON DELETE CASCADE
--    (was missing CASCADE — blocks user deletion)
-- ============================================================
ALTER TABLE public.payments
  DROP CONSTRAINT IF EXISTS payments_user_id_fkey;

ALTER TABLE public.payments
  ADD CONSTRAINT payments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- ============================================================
-- 2. FIX FK: support_messages.sender_id → ON DELETE CASCADE
--    (referenced auth.users without CASCADE)
-- ============================================================
ALTER TABLE public.support_messages
  DROP CONSTRAINT IF EXISTS support_messages_sender_id_fkey;

ALTER TABLE public.support_messages
  ADD CONSTRAINT support_messages_sender_id_fkey
  FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================================
-- 3. FIX FK: kyc_documents.reviewed_by → ON DELETE SET NULL
--    (reviewer deleted → nullify, not block)
-- ============================================================
ALTER TABLE public.kyc_documents
  DROP CONSTRAINT IF EXISTS kyc_documents_reviewed_by_fkey;

ALTER TABLE public.kyc_documents
  ADD CONSTRAINT kyc_documents_reviewed_by_fkey
  FOREIGN KEY (reviewed_by) REFERENCES public.users(id) ON DELETE SET NULL;

-- ============================================================
-- 4. RLS: Superadmin can DELETE orders
-- ============================================================
DROP POLICY IF EXISTS "Superadmin can delete orders" ON public.orders;
CREATE POLICY "Superadmin can delete orders"
  ON public.orders FOR DELETE
  USING (public.get_my_role() = 'superadmin');

-- ============================================================
-- 5. RLS: Superadmin can DELETE users
--    Frontend does: supabase.from('users').delete().eq('id', userId)
--    FK cascades (fixed above) handle orders, payments, tickets, etc.
-- ============================================================
DROP POLICY IF EXISTS "Superadmin can delete users" ON public.users;
CREATE POLICY "Superadmin can delete users"
  ON public.users FOR DELETE
  USING (public.get_my_role() = 'superadmin');

-- ============================================================
-- Done. Verify with:
--   SELECT conname, confdeltype
--   FROM pg_constraint
--   WHERE conname IN (
--     'payments_user_id_fkey',
--     'support_messages_sender_id_fkey',
--     'kyc_documents_reviewed_by_fkey'
--   );
-- confdeltype 'a' = no action, 'c' = cascade, 'n' = set null
-- After patch: payments→'c', support_messages→'c', kyc_documents→'n'
-- ============================================================
