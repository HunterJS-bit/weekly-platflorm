import type { Category, Post, User } from '@/payload-types'

import { localizeCategoryDescription, localizeCategoryTitle } from './localizeCategory'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
  getMediaURL,
} from './seo'

type JsonLdObject = Record<string, unknown>

const ORGANIZATION_ID = absoluteUrl('/#organization')
const WEBSITE_ID = absoluteUrl('/#website')

export const organizationJsonLd = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: absoluteUrl('/'),
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/favicon.svg'),
  },
})

export const websiteJsonLd = (): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: absoluteUrl('/'),
  description: DEFAULT_DESCRIPTION,
  inLanguage: 'sr-Latn-RS',
  publisher: {
    '@id': ORGANIZATION_ID,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${absoluteUrl('/search')}?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
})

export const articleJsonLd = ({
  post,
  path,
  locale = 'sr',
}: {
  post: Partial<Post>
  path: string
  locale?: string
}): JsonLdObject => {
  const url = absoluteUrl(path)
  const image =
    getMediaURL(post.heroImage, 'og') ||
    getMediaURL(post.meta?.image, 'og') ||
    absoluteUrl(DEFAULT_OG_IMAGE)

  const authors = (post.populatedAuthors ?? [])
    .filter((author) => Boolean(author.name))
    .map((author) => ({
      '@type': 'Person',
      name: author.name,
      ...(author.slug ? { url: absoluteUrl(`/author/${author.slug}`) } : {}),
    }))

  const categories = (post.categories ?? [])
    .filter((category): category is Category => typeof category === 'object')
    .map((category) => localizeCategoryTitle(category, locale))

  const tags = (post.tags ?? [])
    .filter((tag): tag is Exclude<typeof tag, number> => typeof tag === 'object')
    .map((tag) => tag.title)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: post.meta?.title || post.title,
    description: post.meta?.description || undefined,
    image: [image],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: authors.length
      ? authors
      : {
          '@type': 'Organization',
          name: SITE_NAME,
        },
    publisher: {
      '@id': ORGANIZATION_ID,
    },
    articleSection: categories[0] || undefined,
    keywords: tags.length ? tags.join(', ') : undefined,
    inLanguage: 'sr-Latn-RS',
  }
}

export const breadcrumbJsonLd = (items: { name: string; path: string }[]): JsonLdObject => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

export const categoryJsonLd = ({
  category,
  path,
  locale = 'sr',
}: {
  category: Category
  path: string
  locale?: string
}): JsonLdObject => {
  const url = absoluteUrl(path)

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: localizeCategoryTitle(category, locale),
    description: localizeCategoryDescription(category, locale) || undefined,
    inLanguage: 'sr-Latn-RS',
    isPartOf: {
      '@id': WEBSITE_ID,
    },
  }
}

export const authorJsonLd = ({
  author,
  path,
}: {
  author: Partial<User>
  path: string
}): JsonLdObject => {
  const url = absoluteUrl(path)
  const image = getMediaURL(author.avatar, 'square')
  const sameAs = [
    author.socials?.website,
    author.socials?.facebook,
    author.socials?.x,
    author.socials?.instagram,
    author.socials?.linkedin,
  ].filter((link): link is string => Boolean(link))

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${url}#profile`,
    url,
    inLanguage: 'sr-Latn-RS',
    mainEntity: {
      '@type': 'Person',
      name: author.name || SITE_NAME,
      description: author.bio || undefined,
      image: image || undefined,
      url,
      sameAs: sameAs.length ? sameAs : undefined,
    },
  }
}

export const webPageJsonLd = ({
  title,
  description,
  path,
  type = 'WebPage',
}: {
  title: string
  description?: string | null
  path: string
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'
}): JsonLdObject => {
  const url = absoluteUrl(path)

  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name: title,
    description: description || undefined,
    inLanguage: 'sr-Latn-RS',
    isPartOf: {
      '@id': WEBSITE_ID,
    },
  }
}
