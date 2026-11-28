'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import { useLocale, useTranslations } from 'next-intl'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { Link } from '@/i18n/navigation'
import { localizeCategoryTitle } from '@/utilities/localizeCategory'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const t = useTranslations('common')
  const locale = useLocale()
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {!metaImage && (
          <span className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            {t('noImage')}
          </span>
        )}
        {metaImage && typeof metaImage !== 'string' && (
          <Media fill imgClassName="object-cover" resource={metaImage} size="33vw" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-4">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const categoryTitle =
                  localizeCategoryTitle(category, locale) || t('untitledCategory')

                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }

              return null
            })}
          </div>
        )}
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && <div className="mt-2">{description && <p>{sanitizedDescription}</p>}</div>}
      </div>
    </article>
  )
}
