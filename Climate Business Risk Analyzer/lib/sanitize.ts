// TODO: import sanitize from 'isomorphic-dompurify'

export const MAX_COMPANY_NAME_LENGTH = 200
export const MAX_LOCATION_LENGTH = 300

// Patterns that suggest prompt injection attempts in user-supplied text fields.
const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /^ignore\b/im,
  /^system:/im,
  /^assistant:/im,
  /^user:/im,
  /^<\/?s>/im,         // XML-style role tags
  /^\[INST\]/im,       // Instruction tokens
]

// TODO: replace slice-only implementation with isomorphic-dompurify HTML stripping
export function sanitizeText(input: string, maxLength: number): string {
  const truncated = input.slice(0, maxLength)
  const lines = truncated.split('\n')
  const cleaned = lines.filter(
    (line) => !PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(line))
  )
  return cleaned.join('\n').trim()
}

export function sanitizeCompanyName(name: string): string {
  return sanitizeText(name, MAX_COMPANY_NAME_LENGTH)
}

export function sanitizeLocation(location: string): string {
  return sanitizeText(location, MAX_LOCATION_LENGTH)
}
