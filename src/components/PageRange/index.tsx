import { getTranslations } from 'next-intl/server'
import React from 'react'

export const PageRange: React.FC<{
  className?: string
  collection?: 'posts'
  collectionLabels?: {
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = async (props) => {
  const { className, currentPage, limit, totalDocs } = props
  const t = await getTranslations('posts')

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  if (typeof totalDocs === 'undefined' || totalDocs === 0) {
    return (
      <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
        {t('noResults')}
      </div>
    )
  }

  const label = totalDocs > 1 ? t('postPlural') : t('postSingular')

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {indexStart > 0
        ? t('showing', { start: indexStart, end: indexEnd, total: totalDocs, label })
        : t('showingFrom', { start: indexStart, end: indexEnd, total: totalDocs, label })}
    </div>
  )
}
