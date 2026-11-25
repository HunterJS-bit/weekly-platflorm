import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { JsonLd } from '@/components/JsonLd'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import { buildSeoMetadata } from '@/utilities/seo'
import { getCachedPostsPage } from '@/utilities/cachedQueries'
import { breadcrumbJsonLd, webPageJsonLd } from '@/utilities/structuredData'
import PageClient from './page.client'

type Args = { params: Promise<{ locale?: string }> }

export default async function Page({ params }: Args) {
  const t = await getTranslations('posts')
  const { locale = 'sr' } = await params
  const posts = await getCachedPostsPage(1)

  return (
    <div className="pt-24 pb-24">
      <JsonLd
        data={[
          webPageJsonLd({
            title: t('title'),
            description: t('metadataDescription'),
            path: '/posts',
            locale,
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

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const t = await getTranslations('posts')
  const { locale = 'sr' } = await params

  return buildSeoMetadata({
    title: t('title'),
    description: t('metadataDescription'),
    path: '/posts',
    locale,
  })
}
