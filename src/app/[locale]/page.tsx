import type { Metadata } from 'next'

import { JsonLd } from '@/components/JsonLd'
import { MagazineHomePage } from '@/components/Magazine/HomePage'
import { buildMagazineFeed } from '@/components/Magazine/fromCms'
import { getCachedPopularTags } from '@/utilities/getPopularTags'
import { getCachedLatestPosts } from '@/utilities/getLatestPosts'
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

  const [posts, tags] = await Promise.all([
    getCachedLatestPosts(),
    getCachedPopularTags(),
  ])

  const feed = buildMagazineFeed(posts, locale)
  const tagList = tags.map((tag) => ({
    title: tag.title,
    slug: tag.slug || undefined,
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
      <MagazineHomePage posts={feed} tags={tagList} />
    </>
  )
}

export const dynamic = 'force-dynamic'
