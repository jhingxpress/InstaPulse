interface WindowEntry {
  timestamps: number[]
}

// In-memory sliding window store.
// Works for single-instance (dev, VPS). Swap Map for Redis in multi-instance prod.
const store = new Map<string, WindowEntry>()

// Prune stale entries every 5 minutes to prevent memory leaks
const PRUNE_INTERVAL = 5 * 60 * 1000
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cutoff = Date.now() - 60_000 * 5
    for (const [key, entry] of store.entries()) {
      entry.timestamps = entry.timestamps.filter(t => t > cutoff)
      if (entry.timestamps.length === 0) store.delete(key)
    }
  }, PRUNE_INTERVAL)
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter?: number // seconds until next allowed request
}

/**
 * Sliding-window rate limiter.
 *
 * @param key       Unique identifier, e.g. `${ip}:submit-lead`
 * @param limit     Max requests allowed in the window (default: 5)
 * @param windowMs  Window size in milliseconds (default: 60 000 = 1 min)
 *
 * Redis upgrade path:
 *   Replace Map operations with:
 *     redis.zadd(key, now, now)
 *     redis.zremrangebyscore(key, '-inf', now - windowMs)
 *     redis.zcard(key)
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key) ?? { timestamps: [] }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(t => now - t < windowMs)

  if (entry.timestamps.length >= limit) {
    const oldest = entry.timestamps[0]
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000)
    store.set(key, entry)
    return { allowed: false, remaining: 0, retryAfter }
  }

  entry.timestamps.push(now)
  store.set(key, entry)

  return { allowed: true, remaining: limit - entry.timestamps.length }
}
