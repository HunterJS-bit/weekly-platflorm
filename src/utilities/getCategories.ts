import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

export type CachedCategory = {
  id: number
  title: string
  titleSr: string | null
  slug: string | null
}

const CATEGORY_LIMIT = 12

/**
 * Header, footer and home all need the same category list. Cache one small
 * projection so they share a single database query instead of hitting
 * Postgres on every request.
 */
export const getCachedCategories = unstable_cache(
  async (): Promise<CachedCategory[]> => {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'categories',
      depth: 0,
      draft: false,
      limit: CATEGORY_LIMIT,
      overrideAccess: false,
      sort: 'title',
    })

    return result.docs.map((category) => ({
      id: category.id,
      title: category.title,
      titleSr: category.titleSr ?? null,
      slug: category.slug ?? null,
    }))
  },
  ['categories-list'],
  {
    tags: ['categories'],
  },
)
