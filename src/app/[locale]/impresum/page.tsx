import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { LegalPage } from '@/components/Magazine/LegalPage'
import { IMPRESSUM_SECTIONS } from '@/content/legal'
import { buildSeoMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('impressum')

  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    path: '/impresum',
  })
}

export default async function ImpressumPage() {
  const t = await getTranslations('impressum')

  return (
    <LegalPage
      title={t('title')}
      description={t('description')}
      lead={t('lead')}
      path="/impresum"
      sections={IMPRESSUM_SECTIONS}
      currentKey="impressum"
    />
  )
}
