'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import React from 'react'

import { useTheme } from '@/providers/Theme'

export const MagazineLogo = ({
  className = '',
  tagline = true,
  light = false,
}: {
  className?: string
  tagline?: boolean
  light?: boolean
}) => {
  const t = useTranslations('common')
  const { theme } = useTheme()
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Infotaktik'
  const useLightText = light || theme === 'dark'

  return (
    <Link href="/" className={`flex items-center gap-4 min-w-0 ${className}`}>
      <span
        className={`font-serif text-[42px] leading-none tracking-tight ${useLightText ? 'text-white' : 'text-[#111]'}`}
      >
        {siteName}
      </span>
      {tagline ? (
        <>
          <span
            className={`hidden sm:block w-px h-10 ${useLightText ? 'bg-white/20' : 'bg-[#e4e4e4]'}`}
          />
          <span
            className={`hidden sm:block text-[10px] leading-tight tracking-[0.18em] uppercase ${useLightText ? 'text-white/60' : 'text-[#9a9a9a]'}`}
          >
            {t('taglineTop')}
            <br />
            {t('taglineBottom')}
          </span>
        </>
      ) : null}
    </Link>
  )
}
