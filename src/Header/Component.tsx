import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import { MagazineLogo } from '@/components/Magazine/Logo'
import { MagazineMenu } from '@/components/Magazine/Menu'
import type { Header } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function Header({ locale = 'sr' }: { locale?: string }) {
  const headerData = await getCachedGlobal('header', 1)()

  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'categories',
    draft: false,
    limit: 12,
    overrideAccess: false,
    sort: 'title',
  })

  return <HeaderClient categories={categories.docs} data={headerData} locale={locale} />
}
