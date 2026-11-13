import { HeaderClient } from './Component.client'
import { getCachedCategories } from '@/utilities/getCategories'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function Header({ locale = 'sr' }: { locale?: string }) {
  const [headerData, categories] = await Promise.all([
    getCachedGlobal('header', 1)(),
    getCachedCategories(),
  ])

  return <HeaderClient categories={categories} data={headerData} locale={locale} />
}
