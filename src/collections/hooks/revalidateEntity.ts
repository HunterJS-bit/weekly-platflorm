import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Revalidates the public page for a collection entry and the pages sitemap
 * whenever a category or author changes.
 */
export const revalidateEntity = (pathPrefix: string, cacheTags: string[] = []) => {
  const afterChange: CollectionAfterChangeHook = ({
    doc,
    previousDoc,
    req: { context },
  }) => {
    if (!context.disableRevalidate) {
      if (doc?.slug) {
        revalidatePath(`${pathPrefix}/${doc.slug}`)
      }

      if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
        revalidatePath(`${pathPrefix}/${previousDoc.slug}`)
      }

      revalidateTag('pages-sitemap', 'max')
      cacheTags.forEach((tag) => revalidateTag(tag, 'max'))
    }

    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
    if (!context.disableRevalidate) {
      if (doc?.slug) {
        revalidatePath(`${pathPrefix}/${doc.slug}`)
      }

      revalidateTag('pages-sitemap', 'max')
      cacheTags.forEach((tag) => revalidateTag(tag, 'max'))
    }

    return doc
  }

  return {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  }
}
