'use client'

import { Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { LEGAL_LINKS } from '@/content/legalLinks'
import { Link, usePathname } from '@/i18n/navigation'
import type { Header as HeaderType } from '@/payload-types'

export const MagazineMenu = ({
  data,
  categories,
}: {
  data: HeaderType
  categories: { title: string; slug?: string | null }[]
}) => {
  const tNav = useTranslations('nav')
  const tCommon = useTranslations('common')
  const tLegal = useTranslations('legal')
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (event.key !== 'Tab') return

      const dialog = dialogRef.current
      if (!dialog) return

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]):not([aria-hidden="true"]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null)

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 50)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      window.clearTimeout(focusTimer)
    }
  }, [open])

  const closeMenu = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  // Let the link's navigation start before the overlay becomes inert. Closing
  // synchronously can cancel the click's default action in some browsers.
  const handleNavClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!(event.target as HTMLElement).closest('a')) return
    window.setTimeout(() => setOpen(false), 0)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={tNav('openMenu')}
        aria-expanded={open}
        aria-controls="magazine-menu"
        onClick={() => setOpen(true)}
        className="flex size-10 items-center justify-center rounded-full text-[#111] transition-colors hover:bg-[#f1f1f1] dark:text-white dark:hover:bg-white/10"
      >
        <Menu className="size-6" />
      </button>

      {mounted &&
        createPortal(
          <div
            ref={dialogRef}
            id="magazine-menu"
            role="dialog"
            aria-modal="true"
            aria-label={tNav('menuLabel')}
            aria-hidden={!open}
            inert={!open}
            className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300 ease-out ${
              open ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <button
              type="button"
              aria-label={tNav('closeMenu')}
              aria-hidden="true"
              tabIndex={-1}
              onClick={closeMenu}
              className="absolute inset-0 h-full w-full cursor-default bg-white/95 backdrop-blur-md dark:bg-black/95"
            />

            <div
              className={`pointer-events-none relative flex min-h-full flex-col p-6 transition-all duration-300 ease-out ${
                open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              }`}
            >
              <div className="magazine-wrap flex items-start justify-between">
                <div className="pointer-events-auto">
                  <p className="font-serif text-4xl text-[#111] dark:text-white">
                    {process.env.NEXT_PUBLIC_SITE_NAME || 'Infotaktik'}
                  </p>
                  <p className="mt-2 text-sm text-[#888]">{tNav('tagline')}</p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label={tNav('closeMenu')}
                  onClick={closeMenu}
                  className="pointer-events-auto flex size-10 items-center justify-center rounded-full text-[#111] transition-colors hover:bg-[#f1f1f1] dark:text-white dark:hover:bg-white/10"
                >
                  <X className="size-7" />
                </button>
              </div>

              <nav
                onClick={handleNavClick}
                className={`magazine-wrap mt-12 grid gap-10 transition-all delay-75 duration-500 ease-out md:grid-cols-3 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                <div className="flex flex-col items-start gap-3 text-2xl font-medium">
                  <Link className="pointer-events-auto" href="/">
                    {tNav('home')}
                  </Link>
                  <Link className="pointer-events-auto" href="/posts">
                    {tNav('posts')}
                  </Link>
                  <Link className="pointer-events-auto" href="/about">
                    {tNav('about')}
                  </Link>
                  <Link className="pointer-events-auto" href="/contact">
                    {tNav('contact')}
                  </Link>
                  <Link className="pointer-events-auto" href="/search">
                    {tCommon('search')}
                  </Link>
                </div>

                <div>
                  <p className="mb-4 text-xs tracking-[0.18em] uppercase text-[#999]">
                    {tNav('categories')}
                  </p>
                  <div className="flex flex-col items-start gap-2 text-lg">
                    {categories.map((category) => (
                      <Link
                        key={category.title}
                        className="pointer-events-auto"
                        href={`/category/${category.slug || category.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-4 text-xs tracking-[0.18em] uppercase text-[#999]">
                    {tLegal('eyebrow')}
                  </p>
                  <div className="flex flex-col items-start gap-2 text-lg">
                    {LEGAL_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        className="pointer-events-auto"
                        href={link.href}
                      >
                        {tLegal(link.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
