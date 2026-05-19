-- Support Tickets & Messages
-- Run after rbac-setup.sql (requires public.get_my_role())
-- Safe to run multiple times

-- ============================================
-- 1. SUPPORT TICKETS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'pending', 'replied', 'closed')),
  unread_user   INTEGER NOT NULL DEFAULT 0,
  unread_admin  INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. SUPPORT MESSAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.support_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id    UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id    UUID NOT NULL REFERENCES auth.users(id),
  sender_role  TEXT NOT NULL CHECK (sender_role IN ('user', 'admin', 'superadmin')),
  message      TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status  ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON public.support_messages(ticket_id);

-- ============================================
-- 4. ENABLE RLS
-- ============================================

ALTER TABLE public.support_tickets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. TICKETS RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users view own tickets"    ON public.support_tickets;
DROP POLICY IF EXISTS "Users create tickets"      ON public.support_tickets;
DROP POLICY IF EXISTS "Users update own tickets"  ON public.support_tickets;
DROP POLICY IF EXISTS "Admins view all tickets"   ON public.support_tickets;
DROP POLICY IF EXISTS "Admins update all tickets" ON public.support_tickets;

CREATE POLICY "Users view own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own tickets"
  ON public.support_tickets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all tickets"
  ON public.support_tickets FOR SELECT
  USING (public.get_my_role() IN ('admin', 'superadmin'));

CREATE POLICY "Admins update all tickets"
  ON public.support_tickets FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'superadmin'));

-- ============================================
-- 6. MESSAGES RLS POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users view own ticket messages" ON public.support_messages;
DROP POLICY IF EXISTS "Users send messages"            ON public.support_messages;
DROP POLICY IF EXISTS "Admins view all messages"       ON public.support_messages;
DROP POLICY IF EXISTS "Admins send messages"           ON public.support_messages;

CREATE POLICY "Users view own ticket messages"
  ON public.support_messages FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM public.support_tickets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users send messages"
  ON public.support_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    ticket_id IN (
      SELECT id FROM public.support_tickets WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins view all messages"
  ON public.support_messages FOR SELECT
  USING (public.get_my_role() IN ('admin', 'superadmin'));

CREATE POLICY "Admins send messages"
  ON public.support_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    public.get_my_role() IN ('admin', 'superadmin')
  );

-- ============================================
-- 7. AUTO-UPDATE updated_at TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION public.update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_ticket_updated_at ON public.support_tickets;
CREATE TRIGGER set_ticket_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_ticket_timestamp();

DO $$
BEGIN
  RAISE NOTICE 'support-setup.sql complete.';
END $$;
