import { NextResponse } from 'next/server'

import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-dynamic'

export async function GET() {
  const SITE_URL = getServerSideURL().replace(/\/$/, '')

  const robotsTxt = `
# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin
Disallow: /payload

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/pages-sitemap.xml
Sitemap: ${SITE_URL}/posts-sitemap.xml

# Crawl delay (optional, adjust based on server capacity)
Crawl-delay: 1
`.trim()

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
