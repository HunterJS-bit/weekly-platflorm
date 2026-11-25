import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { LegalPage } from '@/components/Magazine/LegalPage'
import { PRIVACY_SECTIONS } from '@/content/legal'
import { buildSeoMetadata } from '@/utilities/seo'

type Args = { params: Promise<{ locale?: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const t = await getTranslations('privacy')
  const { locale = 'sr' } = await params

  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    path: '/politika-privatnosti',
    locale,
  })
}

export default async function PrivacyPolicyPage({ params }: Args) {
  const { locale = 'sr' } = await params
  const t = await getTranslations('privacy')

  return (
    <LegalPage
      title={t('title')}
      description={t('description')}
      lead={t('lead')}
      path="/politika-privatnosti"
      sections={PRIVACY_SECTIONS}
      currentKey="privacy"
      locale={locale}
    />
  )
}
