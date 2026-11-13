import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import React from 'react'

import { MagazineLogo } from '@/components/Magazine/Logo'
import { Link } from '@/i18n/navigation'
import { localizeCategoryTitle } from '@/utilities/localizeCategory'

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.6l-5.2-6.8L5.4 22H2.3l7.3-8.4L1 2h6.7l4.7 6.2L18.9 2Zm-2.3 18h1.8L7.5 3.9H5.5L16.6 20Z" />
  </svg>
)

export async function Footer({ locale = 'sr' }: { locale?: string }) {
  const t = await getTranslations('footer')
  const footerData = await getCachedGlobal('footer', 1)()
  const description = footerData?.description || t('description')
  const socialLinks = footerData?.socialLinks || {}

  let footerCategories: { title: string; titleSr?: string | null; slug: string }[] = []
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'categories',
    limit: 6,
    overrideAccess: false,
    sort: 'title',
  })
  if (result.docs.length) {
    footerCategories = result.docs.map((category) => ({
      title: category.title,
      titleSr: category.titleSr,
      slug: category.slug,
    }))
  }

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
          <h3 className="mb-5 text-lg font-semibold">{t('howToFindUs')}</h3>
          <div className="flex flex-col gap-4 text-[#555] dark:text-white/70">
            <p className="whitespace-pre-line">{t('address')}</p>
            <a href="tel:88002345234">8 800 2345 234</a>
          </div>
        </div>
      </div>
      <div className="magazine-wrap border-t border-[#e8e8e8] py-6 text-center text-sm text-[#8a8a8a] dark:border-white/10">
        {t('copyright', { year: new Date().getFullYear() })}
      </div>
    </footer>
  )
}
