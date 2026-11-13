import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { LegalPage } from '@/components/Magazine/LegalPage'
import { PRIVACY_SECTIONS } from '@/content/legal'
import { buildSeoMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('privacy')

  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    path: '/politika-privatnosti',
  })
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('privacy')

  return (
    <LegalPage
      title={t('title')}
      description={t('description')}
      lead={t('lead')}
      path="/politika-privatnosti"
      sections={PRIVACY_SECTIONS}
      currentKey="privacy"
    />
  )
}
