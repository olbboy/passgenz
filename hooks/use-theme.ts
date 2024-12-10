'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/lib/stores/theme-store'
import { useTheme as useNextTheme } from 'next-themes'
import type { ColorMode } from '@/lib/stores/theme-store'

export function useTheme() {
  const { selectedTheme, setMode, setTheme } = useThemeStore()
  const { theme: mode, systemTheme, setTheme: setNextTheme, resolvedTheme } = useNextTheme()

  // Sync next-themes with our store
  useEffect(() => {
    if (mode) {
      setMode(mode as ColorMode)
    }
  }, [mode, setMode])

  const toggleMode = () => {
    const newMode = resolvedTheme === 'dark' ? 'light' : 'dark'
    setNextTheme(newMode)
  }

  return {
    selectedTheme,
    mode: mode as ColorMode,
    resolvedTheme,
    systemTheme,
    setTheme,
    setMode: setNextTheme,
    toggleMode
  }
} 