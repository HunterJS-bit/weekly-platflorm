import { createNavigation } from 'next-intl/navigation'

import { defaultLocale, localePrefix, locales } from './config'

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({
  locales,
  defaultLocale,
  localePrefix,
})
