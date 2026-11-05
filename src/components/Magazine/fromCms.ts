import type { Post } from '@/payload-types'

import { localizeCategoryTitle } from '@/utilities/localizeCategory'

import { demoImages } from './demoPosts'
import type { MagazineCategory, MagazinePost } from './types'

const dateLocale = (locale: string) => (locale === 'sr' ? 'sr-Latn-RS' : 'en-US')

const formatDate = (value: string | null | undefined, locale: string) => {
  if (!value) return locale === 'sr' ? '12. maj 2026.' : 'May 12, 2026'
  return new Date(value).toLocaleDateString(dateLocale(locale), {
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

export const mapCmsPost = (post: Post, index: number, locale = 'sr'): MagazinePost => {
  const image = getImage(post, index)
  const categories: MagazineCategory[] = (post.categories ?? []).flatMap(
    (category): MagazineCategory[] => {
      if (typeof category !== 'object') return []

      const title = localizeCategoryTitle(category, locale)

      return title ? [{ title, slug: category.slug || undefined }] : []
    },
  )

  const commentsCount = Array.isArray(post.comments)
    ? post.comments.filter((comment) => typeof comment === 'object').length
    : 0

  const firstAuthor = post.populatedAuthors?.find((author) => author.name)

  return {
    id: String(post.id),
    title: post.title,
    href: `/posts/${post.slug}`,
    image: image.src,
    imageAlt: image.alt,
    categories: categories.length
      ? categories
      : [{ title: locale === 'sr' ? 'Priče' : 'Stories' }],
    excerpt:
      post.meta?.description ||
      (locale === 'sr'
        ? 'Nova priča iz redakcije Weekly.'
        : 'A new story from the Weekly newsroom.'),
    author:
      post.populatedAuthors
        ?.map((author) => author.name)
        .filter(Boolean)
        .join(', ') || (locale === 'sr' ? 'Urednici Weeklya' : 'Weekly Editors'),
    authorHref: firstAuthor ? `/author/${firstAuthor.slug || firstAuthor.id}` : undefined,
    date: formatDate(post.publishedAt, locale),
    readTime: locale === 'sr' ? '5 min čitanja' : '5 min read',
    comments: commentsCount,
  }
}

export const buildMagazineFeed = (posts: Post[], locale = 'sr'): MagazinePost[] => {
  return posts.map((post, index) => mapCmsPost(post, index, locale))
}
