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
-- 4. RPC: delete_user_as_superadmin(target_user_id)
--    SECURITY DEFINER → bypasses RLS for deletion
--    Deletes public.users profile (cascades to orders, payments, etc.)
--    Note: auth.users identity remains but is orphaned (no profile = no app access)
--    To fully delete auth user, use Supabase Dashboard or Edge Function with service role
-- ============================================================
CREATE OR REPLACE FUNCTION public.delete_user_as_superadmin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role text;
BEGIN
  -- Verify caller is superadmin
  SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();
  IF caller_role IS DISTINCT FROM 'superadmin' THEN
    RAISE EXCEPTION 'Only superadmins can delete users';
  END IF;

  -- Prevent self-deletion
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete your own account';
  END IF;

  -- Delete public profile (cascades to orders, payments, kyc_documents, support_tickets, etc.)
  DELETE FROM public.users WHERE id = target_user_id;
END;
$$;

-- Grant execute to authenticated users (auth check is inside the function)
GRANT EXECUTE ON FUNCTION public.delete_user_as_superadmin(uuid) TO authenticated;

-- ============================================================
-- 5. RLS: Superadmin can DELETE orders
-- ============================================================
DROP POLICY IF EXISTS "Superadmin can delete orders" ON public.orders;
CREATE POLICY "Superadmin can delete orders"
  ON public.orders FOR DELETE
  USING (public.get_my_role() = 'superadmin');

-- ============================================================
-- 6. RLS: Superadmin can DELETE from users table
--    (belt-and-suspenders; RPC above is the preferred path)
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
