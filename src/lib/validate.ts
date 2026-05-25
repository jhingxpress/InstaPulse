export interface ValidationResult {
  valid: boolean
  error?: string
}

// Philippine mobile: 09XXXXXXXXX (11 digits) or +639XXXXXXXXX (12 digits)
const PH_PHONE_RE = /^(09\d{9}|\+639\d{9})$/

/**
 * Validates a Philippine phone number.
 * Accepts spaces, hyphens, and parentheses which are stripped before testing.
 */
export function validatePhilippinePhone(raw: string): ValidationResult {
  const cleaned = raw.replace(/[\s\-\(\)]/g, '')
  if (!cleaned) return { valid: false, error: 'Phone number is required.' }
  if (!PH_PHONE_RE.test(cleaned)) {
    return {
      valid: false,
      error: 'Invalid phone number. Use format: 09XXXXXXXXX or +639XXXXXXXXX',
    }
  }
  return { valid: true }
}

export function validateName(name: string): ValidationResult {
  const t = name.trim()
  if (!t) return { valid: false, error: 'Name is required.' }
  if (t.length < 2) return { valid: false, error: 'Name must be at least 2 characters.' }
  if (t.length > 100) return { valid: false, error: 'Name is too long (max 100 characters).' }
  if (isSpamLike(t)) return { valid: false, error: 'Name appears to be invalid.' }
  return { valid: true }
}

export function validateLocation(location: string): ValidationResult {
  const t = location.trim()
  if (!t) return { valid: false, error: 'Location is required.' }
  if (t.length < 2) return { valid: false, error: 'Location must be at least 2 characters.' }
  if (t.length > 200) return { valid: false, error: 'Location is too long (max 200 characters).' }
  return { valid: true }
}

/**
 * Detects obvious spam / bot-generated text.
 * Returns true if the text looks like spam.
 */
export function isSpamLike(text: string): boolean {
  const t = text.trim()
  if (!t) return false

  // Repeated characters: aaaa, 1111, ----
  if (/(.)\1{4,}/.test(t)) return true

  // All digits
  if (/^\d+$/.test(t)) return true

  // Long consonant cluster — random string (e.g. "xkjdfgpqrst")
  if (/[^aeiou\s\d\-',.]{7,}/i.test(t)) return true

  // Common test / dummy values
  const SPAM_PATTERNS = [
    /^test$/i,
    /^asdf/i,
    /^qwerty/i,
    /^(abc|xyz)$/i,
    /^(foo|bar|baz)$/i,
    /^null$/i,
    /^undefined$/i,
    /^n\/a$/i,
    /^xxx+$/i,
  ]
  if (SPAM_PATTERNS.some(re => re.test(t))) return true

  return false
}
