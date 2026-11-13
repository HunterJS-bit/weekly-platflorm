import type { MagazineSourcePost } from '@/components/Magazine/fromCms'

import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

const HOME_POSTS_LIMIT = 16

/**
 * The home feed is the same for every visitor. Cache the query and invalidate
 * it from the posts revalidation hooks whenever an article changes.
 */
export const getCachedLatestPosts = unstable_cache(
  async (): Promise<MagazineSourcePost[]> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'posts',
      depth: 1,
      draft: false,
      limit: HOME_POSTS_LIMIT,
      overrideAccess: false,
      sort: '-publishedAt',
      // Only fetch what the home feed renders. `authors` is required so the
      // afterRead hook can build `populatedAuthors`.
      select: {
        authors: true,
        categories: true,
        comments: true,
        heroImage: true,
        meta: true,
        populatedAuthors: true,
        publishedAt: true,
        slug: true,
        title: true,
      },
    })

    return result.docs
  },
  ['home-posts'],
  {
    tags: ['posts'],
  },
)
