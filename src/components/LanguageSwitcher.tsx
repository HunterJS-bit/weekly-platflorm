'use client'

import { useLocale } from 'next-intl'
import React, { useTransition } from 'react'

import { type Locale } from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/navigation'

const labels: Record<Locale, string> = {
  en: 'EN',
  sr: 'SR',
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale || isPending) return

    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Language">
      {(Object.keys(labels) as Locale[]).map((option) => {
        const active = option === locale

        return (
          <button
            key={option}
            type="button"
            onClick={() => switchLocale(option)}
            disabled={isPending}
            aria-pressed={active}
            className={`rounded-full px-2 py-1 text-[11px] font-medium tracking-[0.12em] transition-colors disabled:opacity-60 ${
              active
                ? 'bg-[#111] text-white dark:bg-white dark:text-[#111]'
                : 'text-[#777] hover:bg-[#f1f1f1] hover:text-[#111] dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'
            }`}
          >
            {labels[option]}
          </button>
        )
      })}
    </div>
  )
}
