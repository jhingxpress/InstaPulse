/**
 * Strips HTML, script injection, and dangerous characters from a string.
 * Safe for all user-facing text inputs: name, phone, location, message.
 */
export function sanitizeText(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') return ''

  return input
    .replace(/<script[\s\S]*?<\/script>/gi, '')  // Remove full <script> blocks
    .replace(/<[^>]+>/g, '')                       // Strip any remaining HTML tags
    .replace(/javascript:/gi, '')                  // Remove JS protocol links
    .replace(/on\w+\s*=/gi, '')                    // Remove inline event handlers
    .replace(/[<>"'`\\]/g, '')                     // Remove dangerous special chars
    .replace(/\0/g, '')                            // Remove null bytes
    .trim()
    .substring(0, maxLength)
}

/**
 * Sanitize a record of string fields in one call.
 * Non-string values are preserved as-is.
 */
export function sanitizeFields<T extends Record<string, unknown>>(fields: T): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(fields)) {
    result[key] = typeof value === 'string' ? sanitizeText(value) : value
  }
  return result as T
}
