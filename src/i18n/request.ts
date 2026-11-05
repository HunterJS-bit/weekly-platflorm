import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import * as rootParams from 'next/root-params'

import { locales, type Locale } from './config'

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  let locale: Locale

  if (explicitLocale) {
    if (!hasLocale(locales, explicitLocale)) notFound()
    locale = explicitLocale
  } else {
    const paramValue = await rootParams.locale()

    if (!hasLocale(locales, paramValue)) notFound()
    locale = paramValue
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
