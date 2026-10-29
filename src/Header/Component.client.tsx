'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { MagazineLogo } from '@/components/Magazine/Logo'
import { MagazineMenu } from '@/components/Magazine/Menu'
import { defaultCategories } from '@/components/Magazine/demoPosts'
import Link from 'next/link'

interface HeaderClientProps {
  data: Header
  categories?: { title: string; slug?: string | null }[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, categories = [] }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const navCategories = categories.length
    ? categories
    : defaultCategories.map((title) => ({ title, slug: title.toLowerCase() }))

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
        <MagazineMenu data={data} categories={navCategories} />
      </div>
      <nav className="border-t border-[#f0f0f0] dark:border-white/10">
        <div className="magazine-wrap flex gap-8 overflow-x-auto py-3 text-[12px] tracking-[0.18em] uppercase text-[#8a8a8a] scrollbar-none">
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
      </nav>
    </header>
  )
}
