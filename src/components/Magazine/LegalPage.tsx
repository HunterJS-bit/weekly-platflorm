import { ArrowUpRight, Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { JsonLd } from '@/components/JsonLd'
import { Link } from '@/i18n/navigation'
import type { LegalSection } from '@/content/legal'
import { LEGAL_INFO, LEGAL_LINKS } from '@/content/legal'
import { breadcrumbJsonLd, webPageJsonLd } from '@/utilities/structuredData'

type LegalPageProps = {
  title: string
  description: string
  lead: string
  path: string
  sections: LegalSection[]
  currentKey: 'impressum' | 'privacy' | 'terms'
}

export async function LegalPage({
  title,
  description,
  lead,
  path,
  sections,
  currentKey,
}: LegalPageProps) {
  const t = await getTranslations('legal')
  const tCommon = await getTranslations('common')

  const relatedLinks = LEGAL_LINKS.filter((link) => link.key !== currentKey)

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#111] dark:bg-[#111] dark:text-white">
      <JsonLd
        data={[
          webPageJsonLd({
            title,
            description,
            path,
            type: 'WebPage',
          }),
          breadcrumbJsonLd([
            { name: tCommon('home'), path: '/' },
            { name: title, path },
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
          <span className="text-[#111] dark:text-white">{title}</span>
        </nav>
      </div>

      <header className="magazine-wrap border-b border-[#ececec] py-10 dark:border-white/10">
        <p className="text-xs tracking-[0.18em] uppercase text-[#999]">{t('eyebrow')}</p>
        <h1 className="mt-4 max-w-[18ch] text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[64px]">
          {title}
        </h1>
        <p className="mt-6 max-w-[62ch] text-[18px] leading-8 text-[#737373] dark:text-white/60">
          {lead}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] tracking-[0.14em] uppercase text-[#999]">
          <span>
            {t('lastUpdated')}: {LEGAL_INFO.lastUpdated}
          </span>
          <span className="hidden h-3 w-px bg-[#dcdcdc] sm:block dark:bg-white/20" />
          <span>{LEGAL_INFO.siteName}</span>
        </div>
      </header>

      <div className="magazine-wrap grid gap-12 py-14 lg:grid-cols-[240px_1fr] lg:gap-20">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#999]">{t('tocTitle')}</p>
          <nav aria-label={t('tocTitle')} className="mt-4 border-l border-[#e2e2e2] dark:border-white/15">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block border-l border-transparent py-2 pl-4 text-[14px] leading-5 text-[#737373] transition-colors hover:border-[#111] hover:text-[#111] dark:text-white/60 dark:hover:border-white dark:hover:text-white"
              >
                <span className="mr-2 text-[11px] tabular-nums text-[#b5b5b5]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {section.title}
              </a>
            ))}
          </nav>

          <div className="mt-8 border-t border-[#ececec] pt-6 dark:border-white/10">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#999]">
              {t('relatedTitle')}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1 text-[14px] text-[#737373] hover:text-[#111] dark:text-white/60 dark:hover:text-white"
                >
                  {t(link.key)}
                  <ArrowUpRight className="size-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="max-w-[72ch]">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-32 border-b border-[#ececec] pb-10 pt-2 first:pt-0 last:border-b-0 dark:border-white/10"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] tabular-nums tracking-[0.14em] text-[#b5b5b5]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] md:text-[30px]">
                  {section.title}
                </h2>
              </div>

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-4 text-[16px] leading-8 text-[#4a4a4a] dark:text-white/70"
                >
                  {paragraph}
                </p>
              ))}

              {section.list?.length ? (
                <ul className="mt-5 flex flex-col gap-2.5">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[16px] leading-7 text-[#4a4a4a] dark:text-white/70"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[11px] size-1.5 shrink-0 rounded-full bg-[#111] dark:bg-white"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.note ? (
                <p className="mt-5 border-l-2 border-[#111] pl-4 text-[14px] leading-6 text-[#737373] dark:border-white dark:text-white/60">
                  {section.note}
                </p>
              ) : null}
            </section>
          ))}

          <div className="mt-12 border border-[#e4e4e4] bg-white p-8 dark:border-white/15 dark:bg-white/5">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#999]">{t('contactEyebrow')}</p>
            <h2 className="mt-3 text-[26px] font-semibold leading-tight tracking-[-0.02em]">
              {t('contactTitle')}
            </h2>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-7 text-[#737373] dark:text-white/60">
              {t('contactDescription')}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={`mailto:${LEGAL_INFO.email}`}
                className="inline-flex items-center gap-2 text-[15px] font-medium hover:underline"
              >
                <Mail className="size-4" />
                {LEGAL_INFO.email}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 border-b border-[#111] pb-0.5 text-[15px] font-medium hover:opacity-70 dark:border-white"
              >
                {t('contactCta')}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
