import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { LegalPage } from '@/components/Magazine/LegalPage'
import { TERMS_SECTIONS } from '@/content/legal'
import { buildSeoMetadata } from '@/utilities/seo'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('terms')

  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    path: '/uslovi-koriscenja',
  })
}

export default async function TermsOfUsePage() {
  const t = await getTranslations('terms')

  return (
    <LegalPage
      title={t('title')}
      description={t('description')}
      lead={t('lead')}
      path="/uslovi-koriscenja"
      sections={TERMS_SECTIONS}
      currentKey="terms"
    />
  )
}
