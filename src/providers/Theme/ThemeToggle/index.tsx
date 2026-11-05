'use client'

import { Moon, Sun } from 'lucide-react'
import React from 'react'

import { useTheme } from '..'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className="flex size-7 items-center justify-center rounded-full text-[#777] transition-colors hover:bg-[#f1f1f1] hover:text-[#111] dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </button>
  )
}
