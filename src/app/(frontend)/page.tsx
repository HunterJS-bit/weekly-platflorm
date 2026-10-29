import { MagazineHomePage } from '@/components/Magazine/HomePage'
import { defaultCategories } from '@/components/Magazine/demoPosts'
import { buildMagazineFeed } from '@/components/Magazine/fromCms'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [posts, categories] = await Promise.all([
    payload.find({
      collection: 'posts',
      draft: false,
      limit: 16,
      overrideAccess: false,
      sort: '-publishedAt',
      depth: 2,
    }),
    payload.find({
      collection: 'categories',
      draft: false,
      limit: 12,
      overrideAccess: false,
      sort: 'title',
    }),
  ])

  const feed = buildMagazineFeed(posts.docs)
  const tags = categories.docs.length
    ? categories.docs.map((category) => category.title)
    : defaultCategories

  return <MagazineHomePage posts={feed} tags={tags} />
}

export const dynamic = 'force-dynamic'
