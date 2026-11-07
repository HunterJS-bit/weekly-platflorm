import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

import { cn } from '@/utilities/ui'
import { Archivo, Fraunces } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { JsonLd } from '@/components/JsonLd'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { defaultTheme, themeLocalStorageKey } from '@/providers/Theme/shared'
import type { Theme } from '@/providers/Theme/types'
import { themeIsValid } from '@/providers/Theme/types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/utilities/seo'
import { organizationJsonLd, websiteJsonLd } from '@/utilities/structuredData'
import { cookies, draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { isEnabled } = await draftMode()
  const messages = await getMessages()
  const themePreference = (await cookies()).get(themeLocalStorageKey)?.value
  const theme: Theme =
    themePreference && themeIsValid(themePreference) ? themePreference : defaultTheme

  return (
    <html
      className={cn(archivo.variable, fraunces.variable, GeistMono.variable, archivo.className)}
      data-theme={theme}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <NextIntlClientProvider messages={messages}>
          <Providers theme={theme}>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header locale={locale} />
            {children}
            <Footer locale={locale} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  applicationName: SITE_NAME,
  title: `${SITE_NAME} — Ideje, priče i saveti`,
  description: DEFAULT_DESCRIPTION,
  openGraph: mergeOpenGraph(),
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

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#111111',
}
