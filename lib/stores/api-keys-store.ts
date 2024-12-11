import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AIProviderId } from '@/lib/constants/ai-providers'

interface APIKeysState {
  keys: Record<AIProviderId, string>
  getKey: (provider: AIProviderId) => string
  setKey: (provider: AIProviderId, key: string) => void
  removeKey: (provider: AIProviderId) => void
  clearKeys: () => void
}

const DEFAULT_API_KEYS: Record<AIProviderId, string> = {
  openai: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  anthropic: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
  gemini: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
  groq: process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
}

export const useAPIKeysStore = create<APIKeysState>()(
  persist(
    (set, get) => ({
      keys: DEFAULT_API_KEYS,

      getKey: (provider: AIProviderId) => {
        const state = get();
        let key = state.keys[provider];

        // Log chi tiết hơn để debug
        console.log('Debug Info:', {
          provider,
          keyFromStore: key,
          envKey: process.env[`NEXT_PUBLIC_${provider.toUpperCase()}_API_KEY`],
          directGroqKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
          allEnvKeys: process.env,
        });

        // Thử lấy key từ store trước
        if (key && key.trim() !== '') {
          return key;
        }

        // Thử lấy từ env
        const envKey = process.env[`NEXT_PUBLIC_${provider.toUpperCase()}_API_KEY`];
        if (envKey && envKey.trim() !== '') {
          return envKey;
        }

        // Nếu là groq, thử lấy trực tiếp
        if (provider === 'groq') {
          const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
          if (groqKey && groqKey.trim() !== '') {
            return groqKey;
          }
        }

        throw new Error(`API Key for ${provider} is not set`);
      },

      setKey: (provider: AIProviderId, key: string) => 
        set((state) => ({
          keys: { ...state.keys, [provider]: key.trim() }
        })),

      removeKey: (provider: AIProviderId) =>
        set((state) => ({
          keys: { ...state.keys, [provider]: '' }
        })),

      clearKeys: () =>
        set({
          keys: {
            ...DEFAULT_API_KEYS,
            groq: process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
          }
        })
    }),
    {
      name: 'api-keys-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            keys: DEFAULT_API_KEYS
          }
        }
        return persistedState
      }
    }
  )
)