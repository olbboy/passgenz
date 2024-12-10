import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type ThemeType } from '@/config/themes'

export type ColorMode = 'light' | 'dark' | 'system'

interface ThemeState {
  selectedTheme: ThemeType
  mode: ColorMode
  setTheme: (theme: ThemeType) => void
  setMode: (mode: ColorMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      selectedTheme: 'default',
      mode: 'system',
      setTheme: (theme) => set({ selectedTheme: theme }),
      setMode: (mode) => set({ mode })
    }),
    {
      name: 'theme-store'
    }
  )
) 