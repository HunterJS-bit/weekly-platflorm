'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

export const MagazineLogo = ({
  className = '',
  tagline = true,
}: {
  className?: string
  tagline?: boolean
}) => {
  const t = useTranslations('common')
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Infotaktik'
  const [isDarkHeader, setIsDarkHeader] = useState(false)

  useEffect(() => {
    const checkHeaderTheme = () => {
      const header = document.querySelector('header[data-theme="dark"]')
      setIsDarkHeader(!!header)
    }

    checkHeaderTheme()
    const observer = new MutationObserver(checkHeaderTheme)
    const header = document.querySelector('header')
    if (header) {
      observer.observe(header, { attributes: true, attributeFilter: ['data-theme'] })
    }

    return () => observer.disconnect()
  }, [])

  return (
    <Link href="/" className={`flex items-center gap-4 min-w-0 ${className}`}>
      <span className={`font-serif text-[42px] leading-none tracking-tight ${isDarkHeader ? 'text-white' : 'text-[#111]'}`}>
        {siteName}
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
