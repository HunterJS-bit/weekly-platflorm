import type { Metadata } from 'next'
import type { RequiredDataFromCollectionSlug } from 'payload'
import React from 'react'

import { CmsPageView } from '@/components/Magazine/CmsPageView'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { homeStatic } from '@/endpoints/seed/home-static'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedPublishedPage } from '@/utilities/cachedQueries'

type Args = {
  params: Promise<{
    locale?: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { locale = 'sr', slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = (await getCachedPublishedPage(decodedSlug)) as RequiredDataFromCollectionSlug<'pages'> | null

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const pagePath = decodedSlug === 'home' ? '/' : `/${decodedSlug}`

  return <CmsPageView page={page} path={pagePath} locale={locale} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale = 'sr', slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await getCachedPublishedPage(decodedSlug)

  return generateMeta({
    doc: page,
    path: decodedSlug === 'home' ? '/' : `/${decodedSlug}`,
    type: 'website',
    locale,
  })
}
