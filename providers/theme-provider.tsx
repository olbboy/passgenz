'use client'

import { useTheme } from '@/hooks/use-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme() // This will apply the theme

  return <>{children}</>
} 