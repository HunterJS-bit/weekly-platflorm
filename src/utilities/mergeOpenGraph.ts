import type { Metadata } from 'next'

import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from './seo'

const defaultOpenGraph: Metadata['openGraph'] = {
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
  locale: 'sr_RS',
  siteName: SITE_NAME,
  title: SITE_NAME,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
