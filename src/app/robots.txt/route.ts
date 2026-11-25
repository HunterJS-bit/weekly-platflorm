import { NextResponse } from 'next/server'

import { getServerSideURL } from '@/utilities/getURL'

export const dynamic = 'force-static'

export function GET() {
  const siteUrl = getServerSideURL().replace(/\/$/, '')

  const robotsTxt = `# Allow all crawlers
User-agent: *
Allow: /
Allow: /api/media/

Disallow: /admin
Disallow: /admin/*
Disallow: /api
Disallow: /api/*
Disallow: /next
Disallow: /next/*
Disallow: /search
Disallow: /register

Host: ${siteUrl}

Sitemap: ${siteUrl}/sitemap.xml
`.trim()

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
