import { getServerSideSitemapIndex } from 'next-sitemap'

import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'

export async function GET() {
  const siteUrl = getServerSideURL().replace(/\/$/, '')

  return getServerSideSitemapIndex([
    `${siteUrl}/pages-sitemap.xml`,
    `${siteUrl}/posts-sitemap.xml`,
  ])
}
