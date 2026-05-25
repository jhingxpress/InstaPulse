-- Spam & abuse log table
-- Run this in your Supabase SQL editor before deploying.

CREATE TABLE IF NOT EXISTS spam_logs (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  ip         TEXT,
  reason     TEXT        NOT NULL,
  endpoint   TEXT        NOT NULL,
  payload    JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries by IP, reason, and time
CREATE INDEX IF NOT EXISTS spam_logs_ip_idx         ON spam_logs (ip);
CREATE INDEX IF NOT EXISTS spam_logs_reason_idx     ON spam_logs (reason);
CREATE INDEX IF NOT EXISTS spam_logs_created_at_idx ON spam_logs (created_at DESC);

-- Row Level Security: service role writes, admins/superadmins read
ALTER TABLE spam_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view spam logs"
  ON spam_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
        AND role IN ('admin', 'superadmin')
    )
  );
