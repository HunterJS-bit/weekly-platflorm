import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import React from 'react'

import { LegalPage } from '@/components/Magazine/LegalPage'
import { TERMS_SECTIONS } from '@/content/legal'
import { buildSeoMetadata } from '@/utilities/seo'

type Args = { params: Promise<{ locale?: string }> }

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const t = await getTranslations('terms')
  const { locale = 'sr' } = await params

  return buildSeoMetadata({
    title: t('title'),
    description: t('description'),
    path: '/uslovi-koriscenja',
    locale,
  })
}

export default async function TermsOfUsePage({ params }: Args) {
  const { locale = 'sr' } = await params
  const t = await getTranslations('terms')

  return (
    <LegalPage
      title={t('title')}
      description={t('description')}
      lead={t('lead')}
      path="/uslovi-koriscenja"
      sections={TERMS_SECTIONS}
      currentKey="terms"
      locale={locale}
    />
  )
}
