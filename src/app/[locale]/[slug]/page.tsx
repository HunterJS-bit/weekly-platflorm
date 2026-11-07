import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { JsonLd } from '@/components/JsonLd'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { breadcrumbJsonLd, webPageJsonLd } from '@/utilities/structuredData'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

// Render pages on demand so `next build` never needs a database connection.
// Content changes published in the CMS are visible immediately.
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale?: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page
  const pagePath = decodedSlug === 'home' ? '/' : `/${decodedSlug}`
  const breadcrumbs = [
    { name: 'Početna', path: '/' },
    ...(pagePath !== '/' ? [{ name: page.title, path: pagePath }] : []),
  ]

  return (
    <article className="pt-16 pb-24">
      <JsonLd
        data={[
          webPageJsonLd({
            title: page.meta?.title || page.title,
            description: page.meta?.description,
            path: pagePath,
          }),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const { locale = 'sr', slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
  })

  return generateMeta({
    doc: page,
    path: decodedSlug === 'home' ? '/' : `/${decodedSlug}`,
    type: 'website',
    locale,
    noindex: draft,
  })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
