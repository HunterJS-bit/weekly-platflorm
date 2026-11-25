import type { RequiredDataFromCollectionSlug } from 'payload'
import React from 'react'

import PageClient from '@/app/[locale]/[slug]/page.client'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { breadcrumbJsonLd, webPageJsonLd } from '@/utilities/structuredData'

export const CmsPageView = ({
  page,
  path,
  locale = 'sr',
  draft = false,
}: {
  page: RequiredDataFromCollectionSlug<'pages'>
  path: string
  locale?: string
  draft?: boolean
}) => {
  const { hero, layout } = page
  const breadcrumbs = [
    { name: 'Početna', path: '/' },
    ...(path !== '/' ? [{ name: page.title, path }] : []),
  ]

  return (
    <article className="pt-16 pb-24">
      <JsonLd
        data={[
          webPageJsonLd({
            title: page.meta?.title || page.title,
            description: page.meta?.description,
            path,
            locale,
          }),
          breadcrumbJsonLd(breadcrumbs),
        ]}
      />
      <PageClient />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={path === '/' ? '/home' : path} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}
