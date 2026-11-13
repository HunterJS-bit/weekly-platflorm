import type { Metadata } from 'next'

import { JsonLd } from '@/components/JsonLd'
import { MagazineHomePage } from '@/components/Magazine/HomePage'
import { buildMagazineFeed } from '@/components/Magazine/fromCms'
import { getCachedCategories } from '@/utilities/getCategories'
import { getCachedLatestPosts } from '@/utilities/getLatestPosts'
import { localizeCategoryTitle } from '@/utilities/localizeCategory'
import { DEFAULT_DESCRIPTION, SITE_NAME, buildSeoMetadata } from '@/utilities/seo'
import { webPageJsonLd } from '@/utilities/structuredData'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  return buildSeoMetadata({
    title: `${SITE_NAME} — Ideje, priče i saveti`,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale?: string }> }) {
  const { locale = 'sr' } = await params

  const [posts, categories] = await Promise.all([
    getCachedLatestPosts(),
    getCachedCategories(),
  ])

  const feed = buildMagazineFeed(posts, locale)
  const tags = categories.map((category) => ({
    title: localizeCategoryTitle(category, locale),
    slug: category.slug || undefined,
  }))

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          title: `${SITE_NAME} — Ideje, priče i saveti`,
          description: DEFAULT_DESCRIPTION,
          path: '/',
        })}
      />
      <MagazineHomePage posts={feed} tags={tags} />
    </>
  )
}

export const dynamic = 'force-dynamic'
