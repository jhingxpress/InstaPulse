-- Run in Supabase SQL Editor
-- Creates the chat_leads table for AI Sales Agent lead capture

CREATE TABLE IF NOT EXISTS public.chat_leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  location    TEXT,
  interest    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_leads_created_at ON public.chat_leads(created_at DESC);

-- RLS: only service role can read/write (admin dashboard)
ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No public access to chat_leads" ON public.chat_leads;
CREATE POLICY "No public access to chat_leads" ON public.chat_leads
  FOR ALL USING (false);
