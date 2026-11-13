import { getCachedCategories } from '@/utilities/getCategories'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getTranslations } from 'next-intl/server'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import React from 'react'

import { MagazineLogo } from '@/components/Magazine/Logo'
import { LEGAL_LINKS } from '@/content/legalLinks'
import { Link } from '@/i18n/navigation'
import { localizeCategoryTitle } from '@/utilities/localizeCategory'

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.6l-5.2-6.8L5.4 22H2.3l7.3-8.4L1 2h6.7l4.7 6.2L18.9 2Zm-2.3 18h1.8L7.5 3.9H5.5L16.6 20Z" />
  </svg>
)

export async function Footer({ locale = 'sr' }: { locale?: string }) {
  const t = await getTranslations('footer')
  const tLegal = await getTranslations('legal')
  const [footerData, categories] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedCategories(),
  ])
  const description = footerData?.description || t('description')
  const socialLinks = footerData?.socialLinks || {}

  const footerCategories = categories.slice(0, 6).map((category) => ({
    title: category.title,
    titleSr: category.titleSr,
    slug: category.slug ?? '',
  }))

  return (
    <footer className="mt-auto bg-[#f9f9f9] text-[#111] dark:bg-[#111] dark:text-white">
      <div className="magazine-wrap grid gap-12 py-16 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div>
          <MagazineLogo />
          <p className="mt-6 max-w-[42ch] text-[16px] leading-7 text-[#737373]">
            {description}
          </p>
          <div className="mt-6 flex items-center gap-4 text-[#444] dark:text-white">
            {socialLinks.facebook && (
              <a href={socialLinks.facebook} aria-label="Facebook" className="hover:opacity-70">
                <Facebook className="size-4" />
              </a>
            )}
            {socialLinks.x && (
              <a href={socialLinks.x} aria-label="X" className="hover:opacity-70">
                <XIcon />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} aria-label="Instagram" className="hover:opacity-70">
                <Instagram className="size-4" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} aria-label="LinkedIn" className="hover:opacity-70">
                <Linkedin className="size-4" />
              </a>
            )}
            {socialLinks.youtube && (
              <a href={socialLinks.youtube} aria-label="YouTube" className="hover:opacity-70">
                <Youtube className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">{t('categories')}</h3>
          <nav className="flex flex-col gap-3 text-[#555] dark:text-white/70">
            {footerCategories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`}>
                {localizeCategoryTitle(category, locale)}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">{t('legal')}</h3>
          <nav className="flex flex-col gap-3 text-[#555] dark:text-white/70">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {tLegal(link.key)}
              </Link>
            ))}
            <Link href="/contact">{t('getInTouch')}</Link>
          </nav>
        </div>
      </div>
      <div className="magazine-wrap flex flex-col items-center justify-between gap-4 border-t border-[#e8e8e8] py-6 text-center text-sm text-[#8a8a8a] sm:flex-row sm:text-left dark:border-white/10">
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
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
    </footer>
  )
}
