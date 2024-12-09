import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { colorThemes } from '@/config/themes'

interface ThemeState {
  selectedTheme: keyof typeof colorThemes
  setTheme: (theme: keyof typeof colorThemes) => void
  resetTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      selectedTheme: 'default',
      
      setTheme: (theme) => {
        set({ selectedTheme: theme })
      },
      
      resetTheme: () => {
        set({ selectedTheme: 'default' })
      }
    }),
    {
      name: 'theme-store'
    }
  )
) 