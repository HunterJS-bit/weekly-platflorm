import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { JsonLd } from '@/components/JsonLd'
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

export default async function AboutPage() {
  const t = await getTranslations('about')

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd
        data={[
          webPageJsonLd({
            title: t('title'),
            description: t('description'),
            path: '/about',
            type: 'AboutPage',
          }),
          breadcrumbJsonLd([
            { name: 'Početna', path: '/' },
            { name: t('title'), path: '/about' },
          ]),
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{t('title')}</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-6">{t('intro')}</p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            {t('missionTitle')}
          </h2>
          <p className="text-gray-700 mb-4">{t('mission')}</p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            {t('offerTitle')}
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>{t('offerItems.reading')}</li>
            <li>{t('offerItems.community')}</li>
            <li>{t('offerItems.categories')}</li>
            <li>{t('offerItems.writers')}</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            {t('joinTitle')}
          </h2>
          <p className="text-gray-700 mb-4">{t('join')}</p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              {t('getInTouch')}
            </Link>
            <Link
              href="/posts"
              className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
            >
              {t('browseArticles')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
