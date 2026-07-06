-- =====================================================
-- DSSPO PROJECT RAN — Supabase Integration Migration
-- Adds RAN mobile alert capabilities to InstaPulse DB
-- Run this in the Supabase SQL editor ONCE.
--
-- Design rules:
--   • Project RAN is the MASTER client record.
--     Never duplicate CCTV/device/SIM/network fields here.
--   • ran_client_id is the single link between InstaPulse
--     and the RAN client database.
--   • sim_number is stored here ONLY for bridge-side
--     lookup of physical button alerts. It is NEVER
--     returned to mobile users.
--   • mobile_app_status controls access to the mobile app.
--     Admin must set it to 'approved' AND set ran_client_id
--     before a user can use the mobile app.
-- =====================================================

-- ─── 1. Extend users table with RAN-specific columns ─────────────────────
-- sim_number  : INTERNAL USE ONLY — bridge uses it to match physical button
--               alerts to a client. NEVER return this to mobile users.
-- ran_client_id : Linking field. Admin enters the ID from the RAN client form.
-- mobile_app_status : Admin-controlled gate. Must be 'approved' for mobile access.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS sim_number         TEXT,
  ADD COLUMN IF NOT EXISTS ran_client_id      TEXT,
  ADD COLUMN IF NOT EXISTS mobile_app_status  TEXT NOT NULL DEFAULT 'pending'
    CHECK (mobile_app_status IN ('pending', 'approved', 'rejected'));

COMMENT ON COLUMN public.users.sim_number        IS 'SIM900A phone number — bridge internal use only, never exposed to mobile users';
COMMENT ON COLUMN public.users.ran_client_id     IS 'RAN client ID — set by admin after encoding client in Project RAN';
COMMENT ON COLUMN public.users.mobile_app_status IS 'Mobile app access gate: pending | approved | rejected — admin-controlled';

CREATE INDEX IF NOT EXISTS users_sim_number_idx         ON public.users(sim_number);
CREATE INDEX IF NOT EXISTS users_ran_client_id_idx      ON public.users(ran_client_id);
CREATE INDEX IF NOT EXISTS users_mobile_app_status_idx  ON public.users(mobile_app_status);

-- ─── 2. Create ran_alerts table ──────────────────────────────────────────
-- ran_client_id  : Links to the RAN master client record (NOT a foreign key —
--                  RAN uses a separate SQLite DB). Required for all alerts.
-- alert_source   : 'Mobile Application' or 'Physical Button'.
-- user_id        : Set for mobile-originated alerts; NULL for physical button.
-- Client identity fields (name, address, contact) are intentionally absent —
-- they live in the Project RAN client form, not here.

CREATE TABLE IF NOT EXISTS public.ran_alerts (
  id             UUID   DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID   REFERENCES auth.users(id) ON DELETE SET NULL,
  ran_client_id  TEXT   NOT NULL,
  alert_source   TEXT   NOT NULL DEFAULT 'Mobile Application'
                   CHECK (alert_source IN ('Mobile Application', 'Physical Button')),
  latitude       DECIMAL(10, 7),
  longitude      DECIMAL(10, 7),
  address        TEXT,
  alert_type     TEXT   NOT NULL DEFAULT 'emergency'
                   CHECK (alert_type IN ('emergency', 'fire', 'medical', 'crime', 'other')),
  notes          TEXT,
  timestamp      BIGINT NOT NULL,
  status         TEXT   NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'responding', 'resolved', 'cancelled')),
  ran_alert_id   TEXT,
  operator_notes TEXT,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE  public.ran_alerts                IS 'Emergency alerts linked to Project RAN clients. Mobile and physical button sources.';
COMMENT ON COLUMN public.ran_alerts.ran_client_id  IS 'Matches the client ID in the Project RAN SQLite database';
COMMENT ON COLUMN public.ran_alerts.alert_source   IS 'Origin of the alert: Mobile Application or Physical Button';
COMMENT ON COLUMN public.ran_alerts.ran_alert_id   IS 'Alert ID returned by the RAN Express server after forwarding';
COMMENT ON COLUMN public.ran_alerts.operator_notes IS 'Notes added by the RAN operator when updating alert status';

-- ─── 3. Enable Row Level Security ─────────────────────────────────────────

ALTER TABLE public.ran_alerts ENABLE ROW LEVEL SECURITY;

-- ─── 4. RLS Policies ──────────────────────────────────────────────────────
-- Users see ALL alerts for their ran_client_id (mobile + physical button).
-- This requires their mobile_app_status = 'approved' and ran_client_id set.
-- Admins see everything.

DROP POLICY IF EXISTS "Users can view own ran_alerts"   ON public.ran_alerts;
DROP POLICY IF EXISTS "Users can create own ran_alerts" ON public.ran_alerts;
DROP POLICY IF EXISTS "Admins can view all ran_alerts"  ON public.ran_alerts;
DROP POLICY IF EXISTS "Admins can update ran_alerts"    ON public.ran_alerts;

CREATE POLICY "Users can view own ran_alerts"
  ON public.ran_alerts FOR SELECT
  USING (
    ran_client_id = (
      SELECT ran_client_id FROM public.users
      WHERE id = auth.uid()
        AND ran_client_id IS NOT NULL
        AND mobile_app_status = 'approved'
    )
  );

CREATE POLICY "Users can create own ran_alerts"
  ON public.ran_alerts FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND ran_client_id = (
      SELECT ran_client_id FROM public.users
      WHERE id = auth.uid()
        AND ran_client_id IS NOT NULL
        AND mobile_app_status = 'approved'
    )
  );

CREATE POLICY "Admins can view all ran_alerts"
  ON public.ran_alerts FOR SELECT
  USING (public.get_my_role() IN ('admin', 'superadmin'));

CREATE POLICY "Admins can update ran_alerts"
  ON public.ran_alerts FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'superadmin'));

-- ─── 5. Auto-update updated_at ────────────────────────────────────────────

DROP TRIGGER IF EXISTS update_ran_alerts_updated_at ON public.ran_alerts;
CREATE TRIGGER update_ran_alerts_updated_at
  BEFORE UPDATE ON public.ran_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ─── 6. Performance indexes ───────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS ran_alerts_ran_client_id_idx ON public.ran_alerts(ran_client_id);
CREATE INDEX IF NOT EXISTS ran_alerts_user_id_idx       ON public.ran_alerts(user_id);
CREATE INDEX IF NOT EXISTS ran_alerts_alert_source_idx  ON public.ran_alerts(alert_source);
CREATE INDEX IF NOT EXISTS ran_alerts_status_idx        ON public.ran_alerts(status);
CREATE INDEX IF NOT EXISTS ran_alerts_created_at_idx    ON public.ran_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS ran_alerts_timestamp_idx     ON public.ran_alerts(timestamp DESC);

-- ─── 7. Verification ─────────────────────────────────────────────────────
-- After running, verify with:
--   SELECT column_name FROM information_schema.columns
--     WHERE table_name = 'users'
--     AND column_name IN ('sim_number','ran_client_id','mobile_app_status');
--   SELECT column_name FROM information_schema.columns
--     WHERE table_name = 'ran_alerts';
