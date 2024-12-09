export type AIProviderId = 'openai' | 'anthropic' | 'gemini' | 'groq'

export interface AIProvider {
  id: AIProviderId
  name: string
  description: string
  website: string
  apiKeyName: string
  apiKeyLink: string
  models: {
    id: string
    name: string
    contextWindow: number
    maxTokens: number
  }[]
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Leading AI research company behind ChatGPT',
    website: 'https://openai.com',
    apiKeyName: 'OpenAI API Key',
    apiKeyLink: 'https://platform.openai.com/api-keys',
    models: [
      {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        contextWindow: 128000,
        maxTokens: 4096
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        contextWindow: 16385,
        maxTokens: 4096
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'AI research company focused on safe and ethical AI',
    website: 'https://anthropic.com',
    apiKeyName: 'Anthropic API Key',
    apiKeyLink: 'https://console.anthropic.com/account/keys',
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        contextWindow: 200000,
        maxTokens: 4096
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        contextWindow: 200000,
        maxTokens: 4096
      }
    ]
  },
  {
    id: 'gemini',
    name: 'Google AI',
    description: 'Google\'s advanced AI models and APIs',
    website: 'https://ai.google.dev',
    apiKeyName: 'Google AI API Key',
    apiKeyLink: 'https://makersuite.google.com/app/apikey',
    models: [
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        contextWindow: 32000,
        maxTokens: 2048
      }
    ]
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast LLM inference platform',
    website: 'https://groq.com',
    apiKeyName: 'Groq API Key',
    apiKeyLink: 'https://console.groq.com/keys',
    models: [
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        contextWindow: 32768,
        maxTokens: 4096
      },
      {
        id: 'llama2-70b-4096',
        name: 'LLaMA2 70B',
        contextWindow: 4096,
        maxTokens: 4096
      }
    ]
  }
] 