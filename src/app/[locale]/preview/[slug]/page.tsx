import type { Metadata } from 'next'
import type { RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import configPromise from '@payload-config'

import { AdminBar } from '@/components/AdminBar'
import { CmsPageView } from '@/components/Magazine/CmsPageView'
import { generateMeta } from '@/utilities/generateMeta'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale?: string
    slug?: string
  }>
}

const queryDraftPage = async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft: true,
    depth: 2,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return (result.docs[0] as RequiredDataFromCollectionSlug<'pages'> | undefined) || null
}

export default async function PreviewPage({ params: paramsPromise }: Args) {
  const { isEnabled } = await draftMode()
  if (!isEnabled) notFound()

  const { locale = 'sr', slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryDraftPage(decodedSlug)
  if (!page) notFound()

  const pagePath = decodedSlug === 'home' ? '/' : `/${decodedSlug}`

  return (
    <>
      <AdminBar adminBarProps={{ preview: true }} collectionSlug="pages" />
      <CmsPageView page={page} path={pagePath} locale={locale} draft />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled } = await draftMode()
  if (!isEnabled) notFound()

  const { locale = 'sr', slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryDraftPage(decodedSlug)

  return generateMeta({
    doc: page,
    path: decodedSlug === 'home' ? '/' : `/${decodedSlug}`,
    type: 'website',
    locale,
    noindex: true,
  })
}
