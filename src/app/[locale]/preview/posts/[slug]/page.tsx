import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import configPromise from '@payload-config'

import { AdminBar } from '@/components/AdminBar'
import { PostArticle } from '@/components/Magazine/PostArticle'
import type { Post } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    locale?: string
    slug?: string
  }>
}

const queryDraftPost = async (slug: string): Promise<Post | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft: true,
    depth: 2,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs[0] || null
}

export default async function PreviewPost({ params: paramsPromise }: Args) {
  const { isEnabled } = await draftMode()
  if (!isEnabled) notFound()

  const { locale = 'sr', slug = '' } = await paramsPromise
  const post = await queryDraftPost(decodeURIComponent(slug))
  if (!post) notFound()

  return (
    <>
      <AdminBar adminBarProps={{ preview: true }} collectionSlug="posts" />
      <PostArticle post={post} locale={locale} draft />
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { isEnabled } = await draftMode()
  if (!isEnabled) notFound()

  const { locale = 'sr', slug = '' } = await paramsPromise
  const post = await queryDraftPost(decodeURIComponent(slug))

  return generateMeta({
    doc: post,
    path: `/posts/${decodeURIComponent(slug)}`,
    type: 'article',
    locale,
    noindex: true,
  })
}
