'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/lib/stores/theme-store'
import { colorThemes, type Theme, type Colors } from '@/config/themes'

function extractHSLValues(hslString: string) {
  // Remove 'hsl(' and ')' and split the values
  const values = hslString.replace('hsl(', '').replace(')', '').split(' ')
  return values.join(' ')
}

export function useTheme() {
  const { selectedTheme } = useThemeStore()

  useEffect(() => {
    if (!selectedTheme) return

    const theme = colorThemes[selectedTheme as Theme]
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    const colors = isDark ? theme.dark : theme.light

    // Apply colors to CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      const hslValues = extractHSLValues(value as string)
      root.style.setProperty(`--${key}`, hslValues)
    })
  }, [selectedTheme])

  return { selectedTheme }
} 