'use client'

import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { useEffect } from 'react'
import { useThemeStore } from '@/lib/stores/theme-store'
import { colorThemes } from '@/config/themes'

function ThemeColors() {
  const { selectedTheme } = useThemeStore()
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    const theme = colorThemes[selectedTheme]

    if (theme) {
      const colors = resolvedTheme === 'dark' ? theme.dark : theme.light
      Object.entries(colors).forEach(([key, value]) => {
        const hslValues = value.replace('hsl(', '').replace(')', '').split(' ').join(' ')
        root.style.setProperty(`--${key}`, hslValues)
      })
    }
  }, [selectedTheme, resolvedTheme])

  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeColors />
      {children}
    </NextThemeProvider>
  )
} 