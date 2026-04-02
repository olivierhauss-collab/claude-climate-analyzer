import { NextResponse } from 'next/server'

// TODO: import { checkRateLimit } from '@/lib/rate-limit'
// TODO: import { analyzeInputSchema } from '@/lib/schemas'
// TODO: import { buildSystemPrompt, buildUserMessage } from '@/lib/prompt'
// TODO: import { callAnthropic } from '@/lib/anthropic'
// TODO: import { sanitizeCompanyName, sanitizeLocation } from '@/lib/sanitize'

export async function POST(_req: Request): Promise<NextResponse> {
  // TODO: 1. Extract IP and check rate limit (5/hour, 20/day)
  // TODO: 2. Parse and validate request body with analyzeInputSchema
  // TODO: 3. Sanitize text inputs (company name, location)
  // TODO: 4. Build LLM prompt with buildSystemPrompt() + buildUserMessage()
  // TODO: 5. Call Anthropic API via callAnthropic(); retry once on parse failure
  // TODO: 6. Return validated AnalysisResponse as JSON
  return NextResponse.json({})
}
