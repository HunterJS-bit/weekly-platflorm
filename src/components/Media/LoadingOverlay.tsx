'use client'

import { LoaderCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

/** Small, subtle loading state shared by post images wherever they appear. */
export const ImageLoadingOverlay = () => {
  const t = useTranslations('common')

  return (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 animate-pulse bg-[#ececec] dark:bg-white/10"
      />
      <span aria-hidden="true" className="absolute inset-0 z-0 flex items-center justify-center">
        <LoaderCircle className="size-5 animate-spin text-[#b5b5b5] dark:text-white/50" />
      </span>
      <span role="status" className="sr-only">
        {t('loading')}
      </span>
    </>
  )
}
