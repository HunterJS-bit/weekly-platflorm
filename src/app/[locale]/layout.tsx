import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

import { cn } from '@/utilities/ui'
import { Archivo, Fraunces } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import React from 'react'

import { JsonLd } from '@/components/JsonLd'
import { TermsConsent } from '@/components/TermsConsent'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { defaultTheme, themeLocalStorageKey } from '@/providers/Theme/shared'
import { organizationJsonLd, websiteJsonLd } from '@/utilities/structuredData'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/utilities/seo'
import { getServerSideURL } from '@/utilities/getURL'
import { localeBcp47, normalizeLocale } from '@/utilities/locale'

import './globals.css'

const archivo = Archivo({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-archivo',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-fraunces',
  display: 'swap',
})

// Runs before paint so a saved theme never flashes the default light theme.
// This keeps the layout free of server-side cookie reads and therefore cacheable.
const themeScript = `(function(){try{var key='${themeLocalStorageKey}';var cookie=document.cookie.split('; ').find(function(c){return c.indexOf(key+'=')===0});var value=cookie?decodeURIComponent(cookie.split('=').slice(1).join('=')):null;try{value=value||localStorage.getItem(key)}catch(e){}if(value==='dark'||value==='light'){document.documentElement.setAttribute('data-theme',value)}}catch(e){}})();`

type LocaleParams = { params: Promise<{ locale?: string }> }

export default async function RootLayout({ children, params }: LocaleParams & {
  children: React.ReactNode
}) {
  const { locale } = await params
  const resolvedLocale = normalizeLocale(locale)
  const messages = await getMessages()

  return (
    <html
      className={cn(archivo.variable, fraunces.variable, GeistMono.variable, archivo.className)}
      data-theme={defaultTheme}
      lang={resolvedLocale}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd({ locale: resolvedLocale })]} />
        <NextIntlClientProvider messages={messages}>
          <Providers theme={defaultTheme}>
            <Header locale={resolvedLocale} />
            {children}
            <Footer locale={resolvedLocale} />
            <TermsConsent />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params
  const resolvedLocale = normalizeLocale(locale)

  return {
    metadataBase: new URL(getServerSideURL()),
    applicationName: SITE_NAME,
    title: `${SITE_NAME} — Ideje, priče i saveti`,
    description: DEFAULT_DESCRIPTION,
    alternates: {
      canonical: '/',
      languages: { [localeBcp47(resolvedLocale)]: '/' },
    },
    openGraph: mergeOpenGraph(undefined, resolvedLocale),
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} — Ideje, priče i saveti`,
      description: DEFAULT_DESCRIPTION,
      images: [absoluteUrl(DEFAULT_OG_IMAGE)],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#111111',
}
