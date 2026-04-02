import type { NextRequest } from 'next/server'

// TODO: Initialize Ratelimit from @upstash/ratelimit
//   - If RATE_LIMIT_STORE=kv and UPSTASH_REDIS_REST_URL is set: use Upstash Redis
//   - Otherwise: use ephemeralCache (in-memory, resets on cold start)
//
// Rules:
//   - 5 requests per hour per IP
//   - 20 requests per day per IP

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

// TODO: implement real rate limit check using @upstash/ratelimit
//   1. Extract IP from req.headers.get('x-forwarded-for') or req.ip
//   2. Check hourly limit
//   3. Check daily limit
//   4. Return { allowed, remaining, resetAt }
export async function checkRateLimit(_req: NextRequest): Promise<RateLimitResult> {
  return { allowed: true, remaining: 5, resetAt: new Date() }
}
