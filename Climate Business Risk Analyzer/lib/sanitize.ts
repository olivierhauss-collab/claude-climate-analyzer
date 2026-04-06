import DOMPurify from 'isomorphic-dompurify'

export const MAX_COMPANY_NAME_LENGTH = 200
export const MAX_LOCATION_LENGTH = 300

// Patterns that suggest prompt injection attempts in user-supplied text fields.
const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /^ignore\b/im,
  /^system:/im,
  /^assistant:/im,
  /^user:/im,
  /^human:/im,
  /^<\/?s>/im,
  /^\[INST\]/im,
  /^\[\/INST\]/im,
  /^<\|im_start\|>/im,
  /^<\|im_end\|>/im,
  /^###\s*(system|instruction|user|assistant)/im,
  /forget\s+(your|all|previous)\s+(instructions|rules)/im,
  /you\s+are\s+now\s+/im,
  /new\s+instructions?:/im,
  /override\s+(previous|all)\s/im,
]

/**
 * Sanitize a user-supplied text field before injecting into an LLM prompt.
 *
 * 1. Strip all HTML tags via DOMPurify (returns plain text only)
 * 2. Truncate to maxLength
 * 3. Remove lines matching prompt injection patterns
 * 4. Trim whitespace
 */
export function sanitizeText(input: string, maxLength: number): string {
  // Strip all HTML — DOMPurify with no allowed tags returns plain text
  const stripped = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })

  // Truncate
  const truncated = stripped.slice(0, maxLength)

  // Remove lines that match prompt injection patterns
  const lines = truncated.split('\n')
  const cleaned = lines.filter(
    (line) => !PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(line.trim()))
  )

  return cleaned.join('\n').trim()
}

/** Sanitize a company name input. Max 200 characters. */
export function sanitizeCompanyName(name: string): string {
  return sanitizeText(name, MAX_COMPANY_NAME_LENGTH)
}

/** Sanitize a location input. Max 300 characters. */
export function sanitizeLocation(location: string): string {
  return sanitizeText(location, MAX_LOCATION_LENGTH)
}
