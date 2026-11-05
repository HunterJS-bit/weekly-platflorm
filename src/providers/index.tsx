import React from 'react'

import type { Theme } from './Theme/types'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
  theme?: Theme
}> = ({ children, theme }) => {
  return (
    <ThemeProvider initialTheme={theme}>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </ThemeProvider>
  )
}
