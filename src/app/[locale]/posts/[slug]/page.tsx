import type { Metadata } from 'next'

import { PostArticle } from '@/components/Magazine/PostArticle'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import React from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import { getCachedPublishedPost } from '@/utilities/cachedQueries'

type Args = {
  params: Promise<{
    locale?: string
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { locale = 'sr', slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/posts/${decodedSlug}`
  const post = await getCachedPublishedPost(decodedSlug)

  if (!post) return <PayloadRedirects url={url} />

  return <PostArticle post={post} locale={locale} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale = 'sr', slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await getCachedPublishedPost(decodedSlug)

  return generateMeta({
    doc: post,
    path: `/posts/${decodedSlug}`,
    type: 'article',
    locale,
  })
}
