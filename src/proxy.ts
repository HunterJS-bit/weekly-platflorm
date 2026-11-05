import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale, localePrefix } from './i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
  // The public site is Serbian-only for now. Without this, a browser that
  // prefers English would be redirected to /en on the unprefixed homepage.
  localeDetection: false,
})

// Simple in-memory rate limiter
// For production, consider using Redis or a dedicated rate limiting service
const rateLimit = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_MAX = 100 // requests
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds

function getIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = request.headers.get('cf-connecting-ip') // Cloudflare
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp
  }
  if (ip) {
    return ip
  }
  
  // Fallback to a hash of headers if no IP found
  return request.headers.get('user-agent') || 'unknown'
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Locale routing only applies to the frontend. Payload's admin panel and
  // API routes must never be locale-prefixed.
  if (!pathname.startsWith('/api') && !pathname.startsWith('/admin')) {
    // Serbian is the only public locale, so never serve the English-prefixed
    // routes even if someone navigates to them directly.
    if (pathname === '/en' || pathname.startsWith('/en/')) {
      const url = request.nextUrl.clone()
      url.pathname = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
      return NextResponse.redirect(url, 308)
    }

    return intlMiddleware(request)
  }

  // Only rate limit API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Skip rate limiting for GraphQL playground in development
  if (request.nextUrl.pathname === '/api/graphql-playground' && process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  const identifier = getIdentifier(request)
  const now = Date.now()
  
  // Get or create rate limit entry
  const limit = rateLimit.get(identifier)
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new entry
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return NextResponse.next()
  }
  
  // Increment count
  limit.count++
  
  // Check if over limit
  if (limit.count > RATE_LIMIT_MAX) {
    const resetTime = Math.ceil((limit.resetTime - now) / 1000)
    
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_MAX.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetTime.toString(),
          'Retry-After': resetTime.toString(),
        },
      }
    )
  }
  
  // Add rate limit headers to successful response
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX.toString())
  response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX - limit.count).toString())
  response.headers.set('X-RateLimit-Reset', Math.ceil((limit.resetTime - now) / 1000).toString())
  
  return response
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key)
    }
  }
}, RATE_LIMIT_WINDOW)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/api/:path*'],
}
