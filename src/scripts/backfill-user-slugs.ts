import config from '@payload-config'
import { getPayload } from 'payload'

// Users created before the `slug` field existed have no public author URL.
// Generate a slug from the name (or email) for each one.
const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const payload = await getPayload({ config })

try {
  const result = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1000,
    pagination: false,
    where: {
      or: [{ slug: { exists: false } }, { slug: { equals: null } }],
    },
  })

  for (const user of result.docs) {
    const source = user.name || user.email?.split('@')[0] || ''
    const slug = slugify(source)

    if (!slug) {
      payload.logger.warn(`Could not generate a slug for user ${user.id}`)
      continue
    }

    await payload.update({
      collection: 'users',
      id: user.id,
      data: { slug },
    })

    payload.logger.info(`Backfilled slug "${slug}" for user ${user.id}`)
  }
} catch (error) {
  payload.logger.error({ err: error }, 'User slug backfill failed')
  process.exitCode = 1
} finally {
  await payload.destroy()
}
