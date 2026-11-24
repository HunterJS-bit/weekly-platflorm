import type { Metadata } from 'next'

import { defaultLocale } from '@/i18n/config'

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
} from './seo'
import { localeOg, normalizeLocale } from './locale'

const buildDefaultOpenGraph = (localeValue: string): NonNullable<Metadata['openGraph']> => ({
  type: 'website',
  description: DEFAULT_DESCRIPTION,
  images: [
    {
      url: absoluteUrl(DEFAULT_OG_IMAGE),
      width: 1200,
      height: 630,
      alt: SITE_NAME,
    },
  ],
  locale: localeOg(normalizeLocale(localeValue)),
  siteName: SITE_NAME,
  title: SITE_NAME,
})

export const mergeOpenGraph = (
  og?: Metadata['openGraph'],
  locale: string = defaultLocale,
): Metadata['openGraph'] => {
  const defaultOpenGraph = buildDefaultOpenGraph(locale)

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
