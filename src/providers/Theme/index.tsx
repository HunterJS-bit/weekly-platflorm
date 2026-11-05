'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

const getCurrentTheme = (): Theme => {
  const current = document.documentElement.getAttribute('data-theme')
  return themeIsValid(current) ? current : defaultTheme
}

const persistTheme = (theme: Theme) => {
  window.localStorage.setItem(themeLocalStorageKey, theme)
  document.cookie = `${themeLocalStorageKey}=${theme}; path=/; max-age=31536000; SameSite=Lax`
}

export const ThemeProvider = ({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme?: Theme
}) => {
  // The server renders the theme from the cookie, so seeding the state from the
  // same value keeps hydration consistent and avoids a label/icon flash.
  const [theme, setThemeState] = useState<Theme | undefined>(initialTheme)

  const setTheme = useCallback((themeToSet: Theme | null) => {
    let nextTheme: Theme

    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      document.cookie = `${themeLocalStorageKey}=; path=/; max-age=0; SameSite=Lax`
      nextTheme = getImplicitPreference() ?? defaultTheme
    } else {
      persistTheme(themeToSet)
      nextTheme = themeToSet
    }

    document.documentElement.setAttribute('data-theme', nextTheme)
    setThemeState(nextTheme)
  }, [])

  // Migrate preferences stored by older versions that only used localStorage.
  useEffect(() => {
    const stored = window.localStorage.getItem(themeLocalStorageKey)

    if (!themeIsValid(stored) || getCurrentTheme() === stored) {
      return
    }

    persistTheme(stored)
    document.documentElement.setAttribute('data-theme', stored)
    setThemeState(stored)
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
