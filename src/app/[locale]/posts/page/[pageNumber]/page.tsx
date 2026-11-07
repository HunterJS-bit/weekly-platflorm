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
import { notFound, redirect } from 'next/navigation'

// Render on demand; pagination is read from the live database at request time.
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const t = await getTranslations('posts')
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()
  if (sanitizedPageNumber === 1) redirect('/posts')

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

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
  const { pageNumber } = await paramsPromise

  return buildSeoMetadata({
    title: `${t('title')} — ${pageNumber || ''}`,
    description: t('metadataDescription'),
    path: pageNumber === '1' ? '/posts' : `/posts/page/${pageNumber}`,
  })
}
