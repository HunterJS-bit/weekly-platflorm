import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Simple in-memory rate limiter for contact form
const contactRateLimit = new Map<string, { count: number; resetTime: number }>()

const CONTACT_RATE_LIMIT_MAX = 3 // messages per hour
const CONTACT_RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

function getIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp
  }
  if (ip) {
    return ip
  }
  
  return request.headers.get('user-agent') || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, honeypot } = body

    // Honeypot check - if honeypot field is filled, it's a bot
    if (honeypot) {
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      )
    }

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Rate limiting
    const identifier = getIdentifier(request)
    const now = Date.now()
    const limit = contactRateLimit.get(identifier)
    
    if (!limit || now > limit.resetTime) {
      contactRateLimit.set(identifier, {
        count: 1,
        resetTime: now + CONTACT_RATE_LIMIT_WINDOW,
      })
    } else {
      limit.count++
      
      if (limit.count > CONTACT_RATE_LIMIT_MAX) {
        const resetTime = Math.ceil((limit.resetTime - now) / 1000 / 60) // minutes
        return NextResponse.json(
          { 
            error: 'Too many messages. Please try again later.',
            resetInMinutes: resetTime
          },
          { status: 429 }
        )
      }
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      request.headers.get('cf-connecting-ip') ||
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Save to Payload CMS
    const payload = await getPayload({ config: configPromise })
    
    await payload.create({
      collection: 'contact-messages',
      data: {
        name,
        email,
        message,
        ipAddress,
        userAgent,
      },
    })

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of contactRateLimit.entries()) {
    if (now > value.resetTime) {
      contactRateLimit.delete(key)
    }
  }
}, CONTACT_RATE_LIMIT_WINDOW)
