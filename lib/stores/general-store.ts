import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GeneralSettings {
  saveHistory: boolean
  maxHistoryItems: number
  autoFormat: boolean
  defaultTimeout: number
}

interface GeneralState extends GeneralSettings {
  updateSettings: (settings: Partial<GeneralSettings>) => void
  resetSettings: () => void
}

const DEFAULT_SETTINGS: GeneralSettings = {
  saveHistory: true,
  maxHistoryItems: 50,
  autoFormat: true,
  defaultTimeout: 30000,
}

export const useGeneralStore = create<GeneralState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      
      updateSettings: (settings) => 
        set((state) => ({
          ...state,
          ...settings
        })),
        
      resetSettings: () => 
        set(DEFAULT_SETTINGS)
    }),
    {
      name: 'general-store'
    }
  )
) 