import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ---------------------------------------------------------------------------
// Rate limiter for /api/analyze
// Rules: 5 requests/hour + 20 requests/day per IP
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: Date
}

// ---------------------------------------------------------------------------
// In-memory fallback for when Redis is not configured
// ---------------------------------------------------------------------------

interface MemoryEntry {
  count: number
  resetAt: number
}

const memoryStore = new Map<string, MemoryEntry>()

function memoryLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const entry = memoryStore.get(key)

  if (!entry || now >= entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: maxRequests - 1, reset: now + windowMs }
  }

  if (entry.count < maxRequests) {
    entry.count++
    return { success: true, remaining: maxRequests - entry.count, reset: entry.resetAt }
  }

  return { success: false, remaining: 0, reset: entry.resetAt }
}

// ---------------------------------------------------------------------------
// Upstash Redis rate limiter (when configured)
// ---------------------------------------------------------------------------

const useRedis =
  process.env.RATE_LIMIT_STORE === 'kv' &&
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN

let hourlyLimiter: Ratelimit | null = null
let dailyLimiter: Ratelimit | null = null

if (useRedis) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  hourlyLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: false,
    prefix: 'climate-analyzer',
  })

  dailyLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '24 h'),
    analytics: false,
    prefix: 'climate-analyzer',
  })
}

/**
 * Extract the client IP from a Request.
 * Vercel sets x-forwarded-for; fall back to x-real-ip or a default.
 */
function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') ?? '127.0.0.1'
}

const ONE_HOUR_MS = 60 * 60 * 1000
const ONE_DAY_MS = 24 * ONE_HOUR_MS

/**
 * Check both hourly and daily rate limits for the given request.
 */
export async function checkRateLimit(req: Request): Promise<RateLimitResult> {
  const ip = getClientIp(req)

  if (useRedis && hourlyLimiter && dailyLimiter) {
    const [hourly, daily] = await Promise.all([
      hourlyLimiter.limit(`hourly:${ip}`),
      dailyLimiter.limit(`daily:${ip}`),
    ])

    return {
      allowed: hourly.success && daily.success,
      remaining: Math.min(hourly.remaining, daily.remaining),
      resetAt: new Date(Math.min(hourly.reset, daily.reset)),
    }
  }

  // In-memory fallback
  const hourly = memoryLimit(`hourly:${ip}`, 5, ONE_HOUR_MS)
  const daily = memoryLimit(`daily:${ip}`, 20, ONE_DAY_MS)

  return {
    allowed: hourly.success && daily.success,
    remaining: Math.min(hourly.remaining, daily.remaining),
    resetAt: new Date(Math.min(hourly.reset, daily.reset)),
  }
}
