'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export const MagazineMenu = ({
  data,
  categories,
}: {
  data: HeaderType
  categories: { title: string; slug?: string | null }[]
}) => {
  const [open, setOpen] = useState(false)
  const navItems = data?.navItems || []

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex size-10 items-center justify-center text-[#111] dark:text-white"
        >
          <Menu className="size-6" />
        </button>
        <Link
          href="#newsletter"
          className="rounded-full bg-[#111] px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
        >
          Subscribe
        </Link>
      </div>
      {open ? (
        <div className="fixed inset-0 z-50 bg-white/95 p-6 backdrop-blur-sm dark:bg-black/95">
          <div className="magazine-wrap flex items-start justify-between">
            <div>
              <p className="font-serif text-4xl text-[#111] dark:text-white">weekly.</p>
              <p className="mt-2 text-sm text-[#888]">Minimal blog magazine</p>
            </div>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="size-7" />
            </button>
          </div>
          <nav className="magazine-wrap mt-12 grid gap-10 md:grid-cols-3">
            <div className="flex flex-col gap-3 text-2xl font-medium">
              <Link href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link href="/posts" onClick={() => setOpen(false)}>
                Blog
              </Link>
              <Link href="/about" onClick={() => setOpen(false)}>
                About
              </Link>
              <Link href="/search" onClick={() => setOpen(false)}>
                Search
              </Link>
              {navItems.map(({ link }, index) => (
                <CMSLink key={index} {...link} appearance="link" />
              ))}
            </div>
            <div>
              <p className="mb-4 text-xs tracking-[0.18em] uppercase text-[#999]">Categories</p>
              <div className="flex flex-col gap-2 text-lg">
                {categories.map((category) => (
                  <Link
                    key={category.title}
                    href={`/category/${category.slug || category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setOpen(false)}
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs tracking-[0.18em] uppercase text-[#999]">Appearance</p>
              <ThemeSelector />
            </div>
          </nav>
        </div>
      ) : null}
    </>
  )
}
