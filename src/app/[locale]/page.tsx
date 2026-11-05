import { MagazineHomePage } from '@/components/Magazine/HomePage'
import { buildMagazineFeed } from '@/components/Magazine/fromCms'
import { localizeCategoryTitle } from '@/utilities/localizeCategory'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export default async function HomePage({ params }: { params: Promise<{ locale?: string }> }) {
  const { locale = 'sr' } = await params
  const payload = await getPayload({ config: configPromise })

  const [posts, categories] = await Promise.all([
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 16,
      overrideAccess: false,
      sort: '-publishedAt',
      depth: 2,
    }),
    payload.find({
      collection: 'categories',
      draft: false,
      limit: 12,
      overrideAccess: false,
      sort: 'title',
    }),
  ])

  const feed = buildMagazineFeed(posts.docs, locale)
  const tags = categories.docs.map((category) => ({
    title: localizeCategoryTitle(category, locale),
    slug: category.slug || undefined,
  }))

  return <MagazineHomePage posts={feed} tags={tags} />
}

export const dynamic = 'force-dynamic'
