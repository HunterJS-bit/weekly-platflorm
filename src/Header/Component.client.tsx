'use client'
import React from 'react'

import type { Header } from '@/payload-types'

import { MagazineLogo } from '@/components/Magazine/Logo'
import { MagazineMenu } from '@/components/Magazine/Menu'
import { Link } from '@/i18n/navigation'
import { ThemeToggle } from '@/providers/Theme/ThemeToggle'
import { localizeCategoryTitle } from '@/utilities/localizeCategory'

interface HeaderClientProps {
  data: Header
  categories?: { title: string; titleSr?: string | null; slug?: string | null }[]
  locale?: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, categories = [], locale = 'sr' }) => {
  const navCategories = categories.map((cat) => ({
    title: localizeCategoryTitle(cat, locale),
    slug: cat.slug,
  }))

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#111] text-white">
      <div className="magazine-wrap flex items-center justify-between py-4">
        <MagazineLogo light />
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <ThemeToggle />
          </div>
          <MagazineMenu data={data} categories={navCategories} />
        </div>
      </div>
      <nav className="border-t border-white/10">
        <div className="magazine-wrap flex gap-8 overflow-x-auto py-3 text-[12px] tracking-[0.18em] uppercase text-white/60 scrollbar-none">
          {navCategories.map((category) => (
            <Link
              key={category.title}
              href={`/category/${category.slug || category.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-white transition-colors"
            >
              {category.title}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
