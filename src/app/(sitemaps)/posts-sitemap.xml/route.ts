import { getServerSideSitemap, type ISitemapField } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { getMediaURL } from '@/utilities/seo'
import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

type CachedEntry = {
  loc: string
  lastmod: string
  image?: {
    url: string
    alt?: string
  }
}

const getPostsSitemap = unstable_cache(
  async (): Promise<CachedEntry[]> => {
    const payload = await getPayload({ config })
    const SITE_URL = getServerSideURL().replace(/\/$/, '')
    const dateFallback = new Date().toISOString()

    const results = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 1,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    return results.docs
      .filter((post) => Boolean(post?.slug))
      .map((post) => {
        const image =
          post.meta?.image && typeof post.meta.image === 'object'
            ? post.meta.image
            : post.heroImage && typeof post.heroImage === 'object'
              ? post.heroImage
              : null

        const imageUrl = getMediaURL(image, 'og')

        return {
          loc: `${SITE_URL}/posts/${post.slug}`,
          lastmod: post.updatedAt || dateFallback,
          ...(imageUrl
            ? {
                image: {
                  url: imageUrl,
                  alt: image?.alt || undefined,
                },
              }
            : {}),
        }
      })
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
  },
)

export async function GET() {
  const entries = await getPostsSitemap()

  // URL objects are built outside the cache because `unstable_cache`
  // serializes values and would flatten them.
  const sitemap: ISitemapField[] = entries.map((entry) => ({
    loc: entry.loc,
    lastmod: entry.lastmod,
    ...(entry.image
      ? {
          images: [
            {
              loc: new URL(entry.image.url),
              title: entry.image.alt,
              caption: entry.image.alt,
            },
          ],
        }
      : {}),
  }))

  return getServerSideSitemap(sitemap)
}
