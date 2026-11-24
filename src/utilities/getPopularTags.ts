import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import type { Tag } from '@/payload-types'

const fetchPopularTags = async (): Promise<Tag[]> => {
  const payload = await getPayload({ config: configPromise })

  const tags = await payload.find({
    collection: 'tags',
    depth: 0,
    limit: 6,
    sort: '-createdAt',
  })

  return tags.docs
}

export const getCachedPopularTags = unstable_cache(fetchPopularTags, ['popular-tags'], {
  tags: ['tags'],
  revalidate: 3600,
})
