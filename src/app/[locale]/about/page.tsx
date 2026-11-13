import type { Metadata } from 'next'
import { ArrowUpRight, Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { JsonLd } from '@/components/JsonLd'
import { LEGAL_LINKS } from '@/content/legal'
import { Link } from '@/i18n/navigation'
import { buildSeoMetadata } from '@/utilities/seo'
import { breadcrumbJsonLd, webPageJsonLd } from '@/utilities/structuredData'

// The shared layout reads header/footer data from the CMS, so keep this route
// dynamic to avoid a database connection during `next build`.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about')

  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    path: '/about',
  })
}

const VALUE_KEYS = [1, 2, 3] as const
const OFFER_KEYS = ['reading', 'community', 'categories', 'writers'] as const
const STANDARD_KEYS = [1, 2, 3] as const

export default async function AboutPage() {
  const t = await getTranslations('about')
  const tLegal = await getTranslations('legal')
  const tCommon = await getTranslations('common')

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#111] dark:bg-[#111] dark:text-white">
      <JsonLd
        data={[
          webPageJsonLd({
            title: t('title'),
            description: t('description'),
            path: '/about',
            type: 'AboutPage',
          }),
          breadcrumbJsonLd([
            { name: tCommon('home'), path: '/' },
            { name: t('title'), path: '/about' },
          ]),
        ]}
      />

      <div className="magazine-wrap pt-10">
        <nav
          aria-label={tCommon('breadcrumb')}
          className="flex flex-wrap items-center gap-2 text-xs tracking-[0.14em] uppercase text-[#999]"
        >
          <Link href="/" className="hover:text-[#111] dark:hover:text-white">
            {tCommon('home')}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#111] dark:text-white">{t('eyebrow')}</span>
        </nav>
      </div>

      <header className="magazine-wrap border-b border-[#ececec] py-12 dark:border-white/10 md:py-16">
        <p className="text-xs tracking-[0.18em] uppercase text-[#999]">{t('eyebrow')}</p>
        <h1 className="mt-4 max-w-[20ch] text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[72px]">
          {t('title')}
        </h1>
        <div className="mt-8 grid gap-6 border-t border-[#ececec] pt-8 dark:border-white/10 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
          <p className="max-w-[56ch] text-[19px] leading-8 text-[#3d3d3d] dark:text-white/75">
            {t('lead')}
          </p>
          <p className="max-w-[46ch] text-[15px] leading-7 text-[#8a8a8a] dark:text-white/50">
            {t('description')}
          </p>
        </div>
      </header>

      <section className="magazine-wrap grid gap-12 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#999]">{t('introEyebrow')}</p>
          <h2 className="mt-4 text-[36px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[46px]">
            {t('introTitle')}
          </h2>
        </div>
        <div className="max-w-[64ch]">
          <p className="text-[17px] leading-8 text-[#4a4a4a] dark:text-white/70">{t('intro')}</p>
          <p className="mt-5 text-[17px] leading-8 text-[#4a4a4a] dark:text-white/70">
            {t('introSecondary')}
          </p>

          <figure className="mt-10 border-l-2 border-[#111] pl-6 dark:border-white">
            <blockquote className="font-serif text-[24px] leading-[1.35] tracking-[-0.01em] md:text-[30px]">
              {t('missionQuote')}
            </blockquote>
            <figcaption className="mt-4 text-[11px] tracking-[0.18em] uppercase text-[#999]">
              {t('missionTitle')}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-[#ececec] bg-white py-16 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="magazine-wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#999]">
                {t('valuesEyebrow')}
              </p>
              <h2 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[44px]">
                {t('valuesTitle')}
              </h2>
            </div>
            <p className="max-w-[42ch] text-[15px] leading-7 text-[#8a8a8a] dark:text-white/50">
              {t('valuesDescription')}
            </p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-[#ececec] bg-[#ececec] dark:border-white/10 dark:bg-white/10 md:grid-cols-3">
            {VALUE_KEYS.map((value) => (
              <div key={value} className="bg-white p-8 dark:bg-[#141414]">
                <span className="text-[11px] tabular-nums tracking-[0.16em] text-[#b5b5b5]">
                  {String(value).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-[22px] font-semibold leading-7 tracking-[-0.02em]">
                  {t(`value${value}Title`)}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[#737373] dark:text-white/60">
                  {t(`value${value}Description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="magazine-wrap grid gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#999]">{t('offerEyebrow')}</p>
          <h2 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[44px]">
            {t('offerTitle')}
          </h2>
          <p className="mt-4 max-w-[54ch] text-[16px] leading-8 text-[#737373] dark:text-white/60">
            {t('offerDescription')}
          </p>

          <ol className="mt-10 border-t border-[#ececec] dark:border-white/10">
            {OFFER_KEYS.map((key, index) => (
              <li
                key={key}
                className="flex items-baseline gap-5 border-b border-[#ececec] py-5 dark:border-white/10"
              >
                <span className="w-8 shrink-0 text-[12px] tabular-nums tracking-[0.14em] text-[#b5b5b5]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[17px] leading-7">{t(`offerItems.${key}`)}</span>
              </li>
            ))}
          </ol>
        </div>

        <aside className="border border-[#e4e4e4] bg-white p-8 dark:border-white/15 dark:bg-white/5 lg:mt-16">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#999]">
            {t('standardsEyebrow')}
          </p>
          <h2 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.02em]">
            {t('standardsTitle')}
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-[#737373] dark:text-white/60">
            {t('standardsDescription')}
          </p>
          <ul className="mt-6 flex flex-col gap-4">
            {STANDARD_KEYS.map((standard) => (
              <li
                key={standard}
                className="flex gap-3 text-[15px] leading-7 text-[#4a4a4a] dark:text-white/70"
              >
                <span
                  aria-hidden="true"
                  className="mt-[11px] size-1.5 shrink-0 rounded-full bg-[#111] dark:bg-white"
                />
                <span>{t(`standard${standard}`)}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="magazine-wrap pb-16">
        <div className="border border-[#e4e4e4] bg-white p-8 md:p-12 dark:border-white/15 dark:bg-white/5">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#999]">
                {t('joinEyebrow')}
              </p>
              <h2 className="mt-3 text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[42px]">
                {t('joinTitle')}
              </h2>
              <p className="mt-4 max-w-[52ch] text-[16px] leading-8 text-[#737373] dark:text-white/60">
                {t('join')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-[#111] px-6 py-3 text-[13px] font-medium tracking-[0.08em] uppercase text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-[#111]"
              >
                <Mail className="size-4" />
                {t('getInTouch')}
              </Link>
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 border border-[#111] px-6 py-3 text-[13px] font-medium tracking-[0.08em] uppercase transition-colors hover:bg-[#111] hover:text-white dark:border-white dark:hover:bg-white dark:hover:text-[#111]"
              >
                {t('browseArticles')}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="magazine-wrap pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ececec] pt-8 dark:border-white/10">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#999]">{t('legalTitle')}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-[#737373] hover:text-[#111] dark:text-white/60 dark:hover:text-white"
              >
                {tLegal(link.key)}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
