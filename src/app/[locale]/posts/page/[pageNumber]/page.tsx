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
import { notFound, redirect } from 'next/navigation'

type Args = {
  params: Promise<{
    locale?: string
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const t = await getTranslations('posts')
  const { locale = 'sr', pageNumber } = await paramsPromise

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()
  if (sanitizedPageNumber === 1) redirect('/posts')

  const posts = await getCachedPostsPage(sanitizedPageNumber)

  // Avoid indexing empty or out-of-range pagination pages.
  if (sanitizedPageNumber < 1 || sanitizedPageNumber > posts.totalPages) notFound()

  const pagePath = `/posts/page/${sanitizedPageNumber}`

  return (
    <div className="pt-24 pb-24">
      <JsonLd
        data={[
          webPageJsonLd({
            title: `${t('title')} — ${sanitizedPageNumber}`,
            description: t('metadataDescription'),
            path: pagePath,
            locale,
            type: 'CollectionPage',
          }),
          breadcrumbJsonLd([
            { name: 'Početna', path: '/' },
            { name: t('title'), path: '/posts' },
            { name: `${t('title')} — ${sanitizedPageNumber}`, path: pagePath },
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
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const t = await getTranslations('posts')
  const { locale = 'sr', pageNumber } = await paramsPromise

  return buildSeoMetadata({
    title: `${t('title')} — ${pageNumber || ''}`,
    description: t('metadataDescription'),
    path: pageNumber === '1' ? '/posts' : `/posts/page/${pageNumber}`,
    locale,
  })
}
