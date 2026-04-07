import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { analyzeInputSchema } from '@/lib/schemas'
import { callAnthropic } from '@/lib/anthropic'
import { checkRateLimit } from '@/lib/rate-limit'
import { sanitizeCompanyName, sanitizeLocation } from '@/lib/sanitize'

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // 1. Rate limit check
    const rateLimitResult = await checkRateLimit(req)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          resetAt: rateLimitResult.resetAt.toISOString(),
        },
        { status: 429 }
      )
    }

    // 2. Parse and validate request body
    const body: unknown = await req.json()
    const input = analyzeInputSchema.parse(body)

    // 3. Sanitize text inputs
    const sanitizedInput = {
      ...input,
      companyName: sanitizeCompanyName(input.companyName),
      location: {
        ...input.location,
        displayName: sanitizeLocation(input.location.displayName),
      },
    }

    // 4. Call Anthropic API (retry-once on parse failure is handled inside callAnthropic)
    const analysis = await callAnthropic(sanitizedInput)

    // 5. Return validated analysis
    return NextResponse.json(analysis)
  } catch (error) {
    // Zod validation error
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data.', code: 'VALIDATION_ERROR' },
        { status: 400 }
      )
    }

    // Anthropic API errors
    if (error instanceof Error && error.message.includes('API')) {
      return NextResponse.json(
        {
          error: "We couldn't generate an analysis for this company. Please try with different details or contact us.",
          code: 'ANALYSIS_FAILED',
        },
        { status: 502 }
      )
    }

    // Generic server error — never expose raw details
    console.error('[/api/analyze] Unexpected error:', error)
    return NextResponse.json(
      {
        error: 'An unexpected error occurred. Please try again.',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    )
  }
}
