import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export async function Header() {
  const headerData = await getCachedGlobal('header', 1)()

  let categories: { title: string; slug?: string | null }[] = []
  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'categories',
      limit: 12,
      overrideAccess: false,
      sort: 'title',
    })
    categories = result.docs.map((category) => ({
      title: category.title,
      slug: category.slug,
    }))
  } catch {
    categories = []
  }

  return <HeaderClient categories={categories} data={headerData} />
}
