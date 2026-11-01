import config from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'

import { seedProduction } from '@/endpoints/seed/production'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Idempotent demo-content seed for production.
 *
 * Requires a signed-in admin. Safe to call more than once: existing documents
 * are updated rather than deleted.
 */
export async function POST(): Promise<Response> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    return new Response('Action forbidden.', { status: 403 })
  }

  try {
    const result = await seedProduction({ payload })
    return Response.json({ success: true, result })
  } catch (error) {
    payload.logger.error({ err: error, message: 'Error seeding production data' })
    return new Response('Error seeding production data.', { status: 500 })
  }
}
