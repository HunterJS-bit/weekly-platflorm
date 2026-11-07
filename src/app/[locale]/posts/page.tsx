import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { JsonLd } from '@/components/JsonLd'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import React from 'react'
import { buildSeoMetadata } from '@/utilities/seo'
import { breadcrumbJsonLd, webPageJsonLd } from '@/utilities/structuredData'
import PageClient from './page.client'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const t = await getTranslations('posts')
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <JsonLd
        data={[
          webPageJsonLd({
            title: t('title'),
            description: t('metadataDescription'),
            path: '/posts',
            type: 'CollectionPage',
          }),
          breadcrumbJsonLd([
            { name: 'Početna', path: '/' },
            { name: t('title'), path: '/posts' },
          ]),
        ]}
      />
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{t('title')}</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('posts')

  return buildSeoMetadata({
    title: t('title'),
    description: t('metadataDescription'),
    path: '/posts',
  })
}
