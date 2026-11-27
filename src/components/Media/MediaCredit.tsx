'use client'

import { useTranslations } from 'next-intl'
import React from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  credit?: string | null
  creditUrl?: string | null
  className?: string
  linkClassName?: string
}

/** Displays the image author/source and optionally links to it. */
export const MediaCredit: React.FC<Props> = ({ className, credit, creditUrl, linkClassName }) => {
  const t = useTranslations('media')

  if (!credit) return null

  const trimmedURL = creditUrl?.trim()
  const href = trimmedURL
    ? /^https?:\/\//i.test(trimmedURL)
      ? trimmedURL
      : `https://${trimmedURL}`
    : null

  return (
    <span className={cn('text-sm', className)}>
      {t('photoCredit')}{' '}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn('pointer-events-auto underline underline-offset-2', linkClassName)}
        >
          {credit}
        </a>
      ) : (
        credit
      )}
    </span>
  )
}
