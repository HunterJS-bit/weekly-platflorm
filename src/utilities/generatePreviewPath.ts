import { PreviewSearchParams } from '@/app/[locale]/next/preview/route'
import { PayloadRequest, CollectionSlug } from 'payload'

// Preview lives behind its own dynamic route so public pages stay cacheable.
const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/preview/posts',
  pages: '/preview',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const encodedParams = new URLSearchParams({
    path: `${collectionPrefixMap[collection]}/${encodedSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
