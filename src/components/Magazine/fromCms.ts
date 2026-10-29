import type { Post } from '@/payload-types'

import { demoImages, demoPosts } from './demoPosts'
import type { MagazinePost } from './types'

const formatDate = (value?: string | null) => {
  if (!value) return 'May 12, 2026'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const getImage = (post: Post, index: number) => {
  if (post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url) {
    return {
      src: post.heroImage.url,
      alt: post.heroImage.alt || post.title,
    }
  }

  return {
    src: demoImages[index % demoImages.length],
    alt: post.title,
  }
}

export const mapCmsPost = (post: Post, index: number): MagazinePost => {
  const image = getImage(post, index)
  const categories =
    post.categories
      ?.map((category) => (typeof category === 'object' ? category.title : null))
      .filter((title): title is string => Boolean(title)) || []

  const commentsCount = Array.isArray(post.comments)
    ? post.comments.filter((comment) => typeof comment === 'object').length
    : 0

  return {
    id: String(post.id),
    title: post.title,
    href: `/posts/${post.slug}`,
    image: image.src,
    imageAlt: image.alt,
    categories: categories.length ? categories : ['Stories'],
    excerpt: post.meta?.description || 'A new story from the Weekly newsroom.',
    author:
      post.populatedAuthors?.map((author) => author.name).filter(Boolean).join(', ') || 'Weekly Editors',
    date: formatDate(post.publishedAt),
    readTime: '5 min read',
    comments: commentsCount,
  }
}

export const buildMagazineFeed = (posts: Post[]): MagazinePost[] => {
  const fromCms = posts.map(mapCmsPost)
  const used = new Set(fromCms.map((post) => post.title.toLowerCase()))
  const extras = demoPosts.filter((post) => !used.has(post.title.toLowerCase()))
  return [...fromCms, ...extras]
}
