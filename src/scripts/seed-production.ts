import config from '@payload-config'
import { getPayload } from 'payload'

import { seedProduction } from '@/endpoints/seed/production'

const payload = await getPayload({ config })

try {
  const result = await seedProduction({ payload })
  payload.logger.info({ result }, 'Production seed completed')
} catch (error) {
  payload.logger.error({ err: error }, 'Production seed failed')
  process.exitCode = 1
} finally {
  await payload.destroy()
}
