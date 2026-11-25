import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { LegalPage } from '@/components/Magazine/LegalPage'
import { IMPRESSUM_SECTIONS } from '@/content/legal'
import { buildSeoMetadata } from '@/utilities/seo'

type Args = { params: Promise<{ locale?: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const t = await getTranslations('impressum')
  const { locale = 'sr' } = await params

  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    path: '/impresum',
    locale,
  })
}

export default async function ImpressumPage({ params }: Args) {
  const { locale = 'sr' } = await params
  const t = await getTranslations('impressum')

  return (
    <LegalPage
      title={t('title')}
      description={t('description')}
      lead={t('lead')}
      path="/impresum"
      sections={IMPRESSUM_SECTIONS}
      currentKey="impressum"
      locale={locale}
    />
  )
}
