export const locales = ['en', 'sr'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'sr'

export const localePrefix = 'as-needed'
