'use client'

import { useTranslations } from 'next-intl'
import React from 'react'

import { MagazineLogo } from '@/components/Magazine/Logo'
import { Link } from '@/i18n/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error.500')

  return (
    <div className="flex min-h-screen flex-col bg-[#f9f9f9] text-[#111] dark:bg-[#111] dark:text-white">
      <header className="border-b border-[#ececec] bg-white/95 backdrop-blur-sm dark:border-white/10 dark:bg-[#111]/95">
        <div className="magazine-wrap flex items-center justify-between py-4">
          <Link href="/">
            <MagazineLogo />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center py-20">
        <div className="text-center">
          <h1 className="mb-4 text-[120px] font-semibold leading-none tracking-[-0.05em] text-[#111] dark:text-white">
            {t('title')}
          </h1>
          <p className="mb-8 max-w-[42ch] text-[20px] leading-7 text-[#737373] dark:text-white/70">
            {t('description')}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={reset}
              className="inline-block rounded-full bg-[#111] px-8 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#333] dark:bg-white dark:text-[#111] dark:hover:bg-[#f0f0f0]"
            >
              {t('tryAgain')}
            </button>
            <Link
              href="/"
              className="inline-block rounded-full border border-[#ececec] bg-white px-8 py-3 text-[14px] font-medium text-[#111] transition-colors hover:bg-[#f0f0f0] dark:border-white/10 dark:bg-[#111] dark:text-white dark:hover:bg-[#222]"
            >
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
