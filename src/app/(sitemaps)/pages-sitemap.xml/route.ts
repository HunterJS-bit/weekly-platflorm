import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

// Matches the page size used by /posts so paginated URLs are indexable.
const POSTS_PER_PAGE = 12

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL().replace(/\/$/, '')

    const [pages, categories, authors, postCount] = await Promise.all([
      payload.find({
        collection: 'pages',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'categories',
        overrideAccess: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'users',
        overrideAccess: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.count({
        collection: 'posts',
        overrideAccess: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
      }),
    ])

    const entries = new Map<string, ISitemapField>()

    const add = (loc: string, lastmod?: string | null) => {
      if (!loc || entries.has(loc)) return

      entries.set(loc, {
        loc,
        ...(lastmod ? { lastmod } : {}),
      })
    }

    // Static, always-indexable routes.
    add(`${SITE_URL}/`)
    add(`${SITE_URL}/posts`)
    add(`${SITE_URL}/about`)
    add(`${SITE_URL}/contact`)

    // CMS pages. The `home` page maps to the site root.
    for (const page of pages.docs) {
      if (!page?.slug) continue

      add(
        page.slug === 'home' ? `${SITE_URL}/` : `${SITE_URL}/${page.slug}`,
        page.updatedAt,
      )
    }

    // Category archives.
    for (const category of categories.docs) {
      if (!category?.slug) continue

      add(`${SITE_URL}/category/${category.slug}`, category.updatedAt)
    }

    // Author profile pages.
    for (const author of authors.docs) {
      if (!author?.slug) continue

      add(`${SITE_URL}/author/${author.slug}`, author.updatedAt)
    }

    // Paginated article listings.
    const totalPages = Math.ceil((postCount.totalDocs || 0) / POSTS_PER_PAGE)

    for (let page = 2; page <= totalPages; page += 1) {
      add(`${SITE_URL}/posts/page/${page}`)
    }

    return Array.from(entries.values())
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
