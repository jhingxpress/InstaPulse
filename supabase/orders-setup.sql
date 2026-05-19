-- Orders & Payments Setup
-- Run this after rbac-setup.sql
-- Safe to run multiple times

-- ============================================
-- 1. UPDATE ORDERS TABLE STATUS VALUES
-- ============================================

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'paid', 'acknowledged', 'completed', 'cancelled'));

-- Add payment_method and reference columns if not exists
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS transaction_reference TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS package_name TEXT;

-- ============================================
-- 2. UPDATE PAYMENTS TABLE
-- ============================================

ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS reference_number TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================
-- 3. FIX RLS POLICIES FOR ORDERS (non-recursive)
-- ============================================

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Superadmin can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all orders"
  ON public.orders FOR SELECT
  USING (public.get_my_role() IN ('admin', 'superadmin'));

CREATE POLICY "Admin can update orders"
  ON public.orders FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'superadmin'));

-- ============================================
-- 4. FIX RLS POLICIES FOR PAYMENTS (non-recursive)
-- ============================================

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.payments;
DROP POLICY IF EXISTS "Admin can view all payments" ON public.payments;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all payments"
  ON public.payments FOR SELECT
  USING (public.get_my_role() IN ('admin', 'superadmin'));

-- ============================================
-- 5. FIX RLS FOR PACKAGES (ensure public read)
-- ============================================

DROP POLICY IF EXISTS "Anyone can view packages" ON public.packages;
DROP POLICY IF EXISTS "Anyone can view package items" ON public.package_items;

CREATE POLICY "Anyone can view packages"
  ON public.packages FOR SELECT USING (true);

CREATE POLICY "Anyone can view package items"
  ON public.package_items FOR SELECT USING (true);

-- ============================================
-- 6. VERIFICATION
-- ============================================

DO $$
BEGIN
  RAISE NOTICE 'orders-setup.sql complete. Tables ready.';
END $$;
