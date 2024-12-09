import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIProviderId } from '@/lib/constants/ai-providers'

interface APIKeysState {
  keys: Record<AIProviderId, string>
  getKey: (provider: AIProviderId) => string
  setKey: (provider: AIProviderId, key: string) => void
  removeKey: (provider: AIProviderId) => void
  clearKeys: () => void
}

type State = {
  keys: Record<AIProviderId, string>
}

type Actions = {
  getKey: (provider: AIProviderId) => string
  setKey: (provider: AIProviderId, key: string) => void
  removeKey: (provider: AIProviderId) => void
  clearKeys: () => void
}

export const useAPIKeysStore = create<APIKeysState>()(
  persist(
    (set, get) => ({
      keys: {
        openai: '',
        anthropic: '',
        gemini: '',
        groq: ''
      },

      getKey: (provider) => get().keys[provider],

      setKey: (provider, key) => 
        set((state) => ({
          keys: { ...state.keys, [provider]: key }
        })),

      removeKey: (provider) =>
        set((state) => ({
          keys: { ...state.keys, [provider]: '' }
        })),

      clearKeys: () =>
        set({
          keys: {
            openai: '',
            anthropic: '',
            gemini: '',
            groq: ''
          }
        })
    }),
    {
      name: 'api-keys-store'
    }
  )
) 