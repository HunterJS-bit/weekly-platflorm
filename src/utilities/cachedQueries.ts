import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload, type Where } from 'payload'

import type { Category, Page, Post, User } from '@/payload-types'

export type CachedPostsResult = {
  docs: Post[]
  page?: number
  totalDocs: number
  totalPages: number
}

const POST_CARD_SELECT = {
  categories: true,
  content: true,
  createdAt: true,
  heroImage: true,
  meta: true,
  slug: true,
  title: true,
  updatedAt: true,
} as const

const MAGAZINE_POST_SELECT = {
  authors: true,
  categories: true,
  comments: true,
  content: true,
  createdAt: true,
  heroImage: true,
  meta: true,
  populatedAuthors: true,
  publishedAt: true,
  slug: true,
  title: true,
  updatedAt: true,
} as const

const fetchPublishedPost = async (slug: string): Promise<Post | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft: false,
    depth: 2,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs[0] || null
}

const fetchPublishedPage = async (slug: string): Promise<Page | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft: false,
    depth: 2,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs[0] || null
}

const fetchPostsPage = async (page: number): Promise<CachedPostsResult> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit: 12,
    overrideAccess: false,
    page,
    select: POST_CARD_SELECT,
    sort: '-publishedAt',
  })

  return {
    docs: result.docs,
    page: result.page,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  }
}

const fetchCategory = async (slug: string): Promise<Category | null> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: slug } },
  })

  return result.docs[0] || null
}

const fetchCategoryPosts = async (
  categoryId: number | string,
  page: number,
): Promise<CachedPostsResult> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit: 12,
    overrideAccess: false,
    page,
    select: MAGAZINE_POST_SELECT,
    sort: '-publishedAt',
    where: { categories: { in: [categoryId] } },
  })

  return {
    docs: result.docs,
    page: result.page,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
  }
}

const fetchAuthor = async (slug: string): Promise<User | null> => {
  const payload = await getPayload({ config: configPromise })
  const isID = /^\d+$/.test(slug)

  const result = await payload.find({
    collection: 'users',
    depth: 1,
    limit: 1,
    overrideAccess: false,
    where: isID ? { id: { equals: Number(slug) } } : { slug: { equals: slug } },
  })

  return result.docs[0] || null
}

const fetchAuthorPosts = async (authorId: number | string): Promise<Post[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit: 100,
    overrideAccess: false,
    select: MAGAZINE_POST_SELECT,
    sort: '-publishedAt',
    where: { authors: { in: [authorId] } },
  })

  return result.docs
}

const fetchContactPosts = async (): Promise<Post[]> => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit: 3,
    overrideAccess: false,
    select: MAGAZINE_POST_SELECT,
    sort: '-publishedAt',
  })

  return result.docs
}

type RelatedPostsArgs = {
  categoryIDs: number[]
  postID: number
  tagIDs: number[]
  limit?: number
}

/** Fallback for posts without manually linked related posts. */
const fetchRelatedPosts = async ({
  categoryIDs,
  limit = 4,
  postID,
  tagIDs,
}: RelatedPostsArgs): Promise<Post[]> => {
  const payload = await getPayload({ config: configPromise })

  const constraints: Where[] = [{ id: { not_equals: postID } }]
  const matching: Where[] = []

  if (categoryIDs.length > 0) matching.push({ categories: { in: categoryIDs } })
  if (tagIDs.length > 0) matching.push({ tags: { in: tagIDs } })
  if (matching.length > 0) constraints.push({ or: matching })

  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit,
    overrideAccess: false,
    select: POST_CARD_SELECT,
    sort: '-publishedAt',
    where: { and: constraints },
  })

  return result.docs
}

export const getCachedPublishedPost = unstable_cache(fetchPublishedPost, ['published-post'], {
  tags: ['posts'],
})

export const getCachedPublishedPage = unstable_cache(fetchPublishedPage, ['published-page'], {
  tags: ['pages'],
})

export const getCachedPostsPage = unstable_cache(fetchPostsPage, ['posts-page'], {
  tags: ['posts'],
})

export const getCachedCategory = unstable_cache(fetchCategory, ['category'], {
  tags: ['categories'],
})

export const getCachedCategoryPosts = unstable_cache(fetchCategoryPosts, ['category-posts'], {
  tags: ['posts'],
})

export const getCachedAuthor = unstable_cache(fetchAuthor, ['author'], {
  tags: ['users'],
})

export const getCachedAuthorPosts = unstable_cache(fetchAuthorPosts, ['author-posts'], {
  tags: ['posts'],
})

export const getCachedContactPosts = unstable_cache(fetchContactPosts, ['contact-posts'], {
  tags: ['posts'],
})

export const getCachedRelatedPosts = unstable_cache(fetchRelatedPosts, ['related-posts'], {
  tags: ['posts'],
})
