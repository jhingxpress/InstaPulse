import { supabaseAdmin } from '@/lib/supabase-server'

export interface SpamLogEntry {
  ip: string
  reason: string
  endpoint: string
  payload?: Record<string, unknown>
}

/**
 * Logs a rejected or suspicious request to the spam_logs table.
 * Silent fail — never throws, so it never breaks the main request flow.
 *
 * Requires the spam_logs table (see supabase/spam-logs.sql).
 */
export async function logSpam(entry: SpamLogEntry): Promise<void> {
  try {
    const db = supabaseAdmin()
    await (db as any).from('spam_logs').insert({
      ip: entry.ip ?? 'unknown',
      reason: entry.reason,
      endpoint: entry.endpoint,
      payload: entry.payload ?? null,
    })
  } catch (err) {
    console.error('[spam-logger] Failed to write spam log:', err)
  }
}
