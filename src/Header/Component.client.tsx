'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { MagazineLogo } from '@/components/Magazine/Logo'
import { MagazineMenu } from '@/components/Magazine/Menu'
import { LEGAL_LINKS } from '@/content/legalLinks'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from '@/providers/Theme/ThemeToggle'
import { localizeCategoryTitle } from '@/utilities/localizeCategory'

interface HeaderClientProps {
  data: Header
  categories?: { title: string; titleSr?: string | null; slug?: string | null }[]
  locale?: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, categories = [], locale = 'sr' }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const tLegal = useTranslations('legal')
  const navCategories = categories.map((cat) => ({
    title: localizeCategoryTitle(cat, locale),
    slug: cat.slug,
  }))

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="sticky top-0 z-30 border-b border-[#ececec] bg-white/95 backdrop-blur-sm dark:border-white/10 dark:bg-[#111]/95"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="magazine-wrap flex items-center justify-between py-4">
        <MagazineLogo />
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 rounded-full border border-[#ececec] bg-white/70 p-1 dark:border-white/10 dark:bg-white/5">
            <ThemeToggle />
          </div>
          <MagazineMenu data={data} categories={navCategories} />
        </div>
      </div>
      <nav className="border-t border-[#f0f0f0] dark:border-white/10">
        <div className="magazine-wrap flex items-center justify-between gap-8 py-3">
          <div className="flex gap-8 overflow-x-auto text-[12px] tracking-[0.18em] uppercase text-[#8a8a8a] scrollbar-none">
            {navCategories.map((category) => (
              <Link
                key={category.title}
                href={`/category/${category.slug || category.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-[#111] dark:hover:text-white"
              >
                {category.title}
              </Link>
            ))}
          </div>
          <div className="hidden shrink-0 items-center gap-5 text-[11px] tracking-[0.16em] uppercase text-[#9a9a9a] md:flex">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#111] dark:hover:text-white"
              >
                {tLegal(link.key)}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
