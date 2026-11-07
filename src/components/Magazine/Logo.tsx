import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'

export const MagazineLogo = ({
  className = '',
  tagline = true,
}: {
  className?: string
  tagline?: boolean
}) => {
  const t = useTranslations('common')
  return (
    <Link href="/" className={`flex items-center gap-4 min-w-0 ${className}`}>
      <span className="font-serif text-[42px] leading-none tracking-tight text-[#111] dark:text-white lowercase">
        FrontLine
      </span>
      {tagline ? (
        <>
          <span className="hidden sm:block w-px h-10 bg-[#e4e4e4] dark:bg-white/20" />
          <span className="hidden sm:block text-[10px] leading-tight tracking-[0.18em] uppercase text-[#9a9a9a]">
            {t('taglineTop')}
            <br />
            {t('taglineBottom')}
          </span>
        </>
      ) : null}
    </Link>
  )
}
