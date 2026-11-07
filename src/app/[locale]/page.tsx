import type { Metadata } from 'next'

import { JsonLd } from '@/components/JsonLd'
import { MagazineHomePage } from '@/components/Magazine/HomePage'
import { buildMagazineFeed } from '@/components/Magazine/fromCms'
import { localizeCategoryTitle } from '@/utilities/localizeCategory'
import { DEFAULT_DESCRIPTION, SITE_NAME, buildSeoMetadata } from '@/utilities/seo'
import { webPageJsonLd } from '@/utilities/structuredData'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
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
