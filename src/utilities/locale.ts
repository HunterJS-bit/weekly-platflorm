import { defaultLocale, locales, type Locale } from '@/i18n/config'

export type { Locale } from '@/i18n/config'

export const normalizeLocale = (value?: string | null): Locale => {
  if (value && (locales as readonly string[]).includes(value)) {
    return value as Locale
  }

  return defaultLocale
}

/** Build a path for a locale. The default locale uses the bare path (`as-needed`). */
export const localizedPath = (locale: Locale, path = '/'): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`

  if (locale === defaultLocale) return normalized

  return `/${locale}${normalized === '/' ? '' : normalized}`
}

/** BCP-47 tag used in JSON-LD and sitemap hreflang attributes. */
export const localeBcp47 = (locale: Locale): string =>
  locale === 'sr' ? 'sr-Latn-RS' : locale

/** Open Graph locale (`language_TERRITORY` style). */
export const localeOg = (locale: Locale): string => (locale === 'sr' ? 'sr_RS' : locale)

export const localeAlternates = (
  locale: Locale,
  canonicalUrl: string,
): Record<string, string> => ({
  [localeBcp47(locale)]: canonicalUrl,
})
