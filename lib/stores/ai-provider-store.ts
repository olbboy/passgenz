import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIProviderId } from '@/lib/constants/ai-providers'

interface ModelSettings {
  temperature: number
  top_p: number
  maxTokens: number
  truncateResponse: boolean
  maxResponseLength: number
}

type State = {
  selectedProvider: AIProviderId
  modelSettings: ModelSettings
}

type Actions = {
  setProvider: (provider: AIProviderId) => void
  updateSettings: (settings: Partial<ModelSettings>) => void
  resetSettings: () => void
}

type AIProviderState = State & Actions

const DEFAULT_SETTINGS: ModelSettings = {
  temperature: 0.1,
  top_p: 0.1,
  maxTokens: 1024,
  truncateResponse: true,
  maxResponseLength: 2048
}

export const useAIProviderStore = create<AIProviderState>()(
  persist(
    (set) => ({
      selectedProvider: 'gemini',
      modelSettings: DEFAULT_SETTINGS,
      
      setProvider: (provider) => 
        set({ selectedProvider: provider }),
      
      updateSettings: (settings) => 
        set((state) => ({
          modelSettings: { ...state.modelSettings, ...settings }
        })),
        
      resetSettings: () => 
        set({ modelSettings: DEFAULT_SETTINGS })
    }),
    {
      name: 'ai-provider-store'
    }
  )
) 