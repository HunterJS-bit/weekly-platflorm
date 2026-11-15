import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Tag } from '@/payload-types'

export const getCachedPopularTags = async (): Promise<Tag[]> => {
  const payload = await getPayload({ config: configPromise })

  const tags = await payload.find({
    collection: 'tags',
    depth: 0,
    limit: 6,
    sort: '-createdAt',
  })

  return tags.docs
}
