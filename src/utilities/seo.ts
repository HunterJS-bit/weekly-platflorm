import type { Metadata } from 'next'

import type { Media } from '@/payload-types'

import { getServerSideURL } from './getURL'

export const SITE_NAME = 'InfoTaktik'
export const DEFAULT_DESCRIPTION = 'Vaš nedeljni nezavisni internet magazin. Donosimo vam analize, priče i perspektive iz prvih redova, bez kompromisa. Informišite se drugačije.'

export const DEFAULT_OG_IMAGE = '/og-default.jpg'

export const absoluteUrl = (path = '/'): string => {
  const base = getServerSideURL().replace(/\/$/, '')

  if (!path) return base
  if (/^https?:\/\//i.test(path)) return path

  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export const getMediaURL = (
  image?: Media | number | null,
  preferredSize: 'og' | 'xlarge' | 'large' | 'medium' = 'og',
): string | null => {
  if (!image || typeof image !== 'object') return null

  const sizedUrl = image.sizes?.[preferredSize]?.url
  const url = sizedUrl || image.url

  return url ? absoluteUrl(url) : null
}

export const buildSeoTitle = (title?: string | null): string => {
  if (!title) return SITE_NAME
  if (title.includes(SITE_NAME)) return title

  return `${title} | ${SITE_NAME}`
}

type SeoMetadataArgs = {
  title?: string | null
  description?: string | null
  path?: string
  image?: string | null
  imageAlt?: string | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  authors?: string[]
  section?: string | null
  tags?: string[]
  noindex?: boolean
}

export const buildSeoMetadata = ({
  title,
  description,
  path = '/',
  image,
  imageAlt,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  noindex = false,
}: SeoMetadataArgs): Metadata => {
  const canonical = absoluteUrl(path)
  const resolvedTitle = buildSeoTitle(title)
  const resolvedDescription = description || DEFAULT_DESCRIPTION
  const resolvedImage = image || absoluteUrl(DEFAULT_OG_IMAGE)

  const openGraph = {
    type,
    url: canonical,
    title: resolvedTitle,
    description: resolvedDescription,
    siteName: SITE_NAME,
    locale: 'sr_RS',
    images: [
      {
        url: resolvedImage,
        width: 1200,
        height: 630,
        alt: imageAlt || resolvedTitle,
      },
    ],
    ...(type === 'article'
      ? {
          publishedTime: publishedTime || undefined,
          modifiedTime: modifiedTime || undefined,
          authors: authors?.length ? authors : undefined,
          section: section || undefined,
          tags: tags?.length ? tags : undefined,
        }
      : {}),
  } as Metadata['openGraph']

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical,
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [resolvedImage],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  }
}
