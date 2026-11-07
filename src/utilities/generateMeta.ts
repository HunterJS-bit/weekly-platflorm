import type { Metadata } from 'next'

import type { Page, Post } from '../payload-types'

import { localizeCategoryTitle } from './localizeCategory'
import { buildSeoMetadata, getMediaURL } from './seo'

type MetaDoc = Partial<Page> | Partial<Post>

export const generateMeta = async (args: {
  doc: MetaDoc | null
  path?: string
  type?: 'website' | 'article'
  locale?: string
  noindex?: boolean
}): Promise<Metadata> => {
  const { doc, path, type, locale = 'sr', noindex } = args

  const isPost = Boolean(doc && 'publishedAt' in doc)
  const post = isPost ? (doc as Partial<Post>) : null

  const categories = (post?.categories ?? [])
    .map((category) =>
      typeof category === 'object' ? localizeCategoryTitle(category, locale) : null,
    )
    .filter((title): title is string => Boolean(title))

  const tags = (post?.tags ?? [])
    .map((tag) => (typeof tag === 'object' ? tag.title : null))
    .filter((title): title is string => Boolean(title))

  const authors = (post?.populatedAuthors ?? [])
    .map((author) => author.name)
    .filter((name): name is string => Boolean(name))

  const image = getMediaURL(doc?.meta?.image, 'og')
  const imageAlt =
    doc?.meta?.image && typeof doc.meta.image === 'object' ? doc.meta.image.alt : undefined

  const resolvedPath = path ?? (typeof doc?.slug === 'string' ? `/${doc.slug}` : '/')

  return buildSeoMetadata({
    title: doc?.meta?.title || doc?.title,
    description: doc?.meta?.description,
    path: resolvedPath,
    image,
    imageAlt,
    type: type ?? (isPost ? 'article' : 'website'),
    publishedTime: post?.publishedAt,
    modifiedTime: doc?.updatedAt,
    authors,
    section: categories[0],
    tags,
    noindex,
  })
}
