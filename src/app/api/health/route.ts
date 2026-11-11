import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import config from '@payload-config'

/**
 * Health check endpoint for uptime monitoring and load balancer health checks
 * 
 * Returns:
 * - 200 OK if the application is healthy
 * - 503 Service Unavailable if the database is unreachable
 * 
 * Usage: GET /api/health
 */
export async function GET() {
  try {
    // Check database connectivity
    const payload = await getPayload({ config })
    
    // Simple database query to verify connection
    await payload.find({
      collection: 'users',
      limit: 1,
      overrideAccess: true,
    })

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 },
    )
  }
}
