import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

// Định nghĩa kiểu cho biến môi trường
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_API_KEY: string;
      ANTHROPIC_API_KEY: string;
      GEMINI_API_KEY: string;
      GROQ_API_KEY: string;
      OPENROUTER_API_KEY: string;
    }
  }
}

// Interface cho tin nhắn chat
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Interface cho body của request
interface RequestBody {
  messages: ChatMessage[];
  provider: string;
  model?: string;
  userApiKey?: string;
  temperature?: number;
  top_p?: number;
  maxTokens?: number;
}

// Interface cho response từ AI
interface AIResponse {
  content: string;
  error?: string;
}

export const runtime = 'edge';

// Hàm lấy API key với xử lý lỗi
function getApiKey(provider: string, userApiKey?: string): string {
  // Nếu có userApiKey từ request, sử dụng nó
  if (userApiKey) {
    return userApiKey;
  }

  // Nếu không, lấy từ biến môi trường
  const envKey = process.env[`${provider.toUpperCase()}_API_KEY`];
  if (!envKey) {
    throw new Error(`Không tìm thấy API key cho provider: ${provider}`);
  }
  
  return envKey;
}

// Hàm xử lý lỗi chung
function handleError(error: unknown): Response {
  console.error('AI Router Error:', error);
  const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
  return new Response(
    JSON.stringify({ 
      error: 'Lỗi máy chủ nội bộ',
      details: errorMessage 
    }), 
    { status: 500 }
  );
}

// Hàm kiểm tra và xử lý request body
function validateRequestBody(body: any): RequestBody {
  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    throw new Error('Messages array là bắt buộc và không được rỗng');
  }

  if (!body.provider) {
    throw new Error('Provider là bắt buộc');
  }

  return {
    messages: body.messages,
    provider: body.provider,
    model: body.model,
    userApiKey: body.userApiKey,
    temperature: body.temperature || 0.7,
    top_p: body.top_p || 1,
    maxTokens: body.maxTokens || 1000
  };
}

// Update the MessageParam interface to match the expected types
interface MessageParam {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages, provider, userApiKey, temperature = 0.7, top_p = 1, maxTokens } = await request.json();
    
    // Lấy API key từ header
    const apiKey = request.headers.get('X-Provider-API-Key') || userApiKey;
    
    if (!apiKey) {
      throw new Error(`API key is required`);
    }

    let response;
    
    switch (provider) {
      case 'groq': {
        const groq = new Groq({ apiKey });
        response = await groq.chat.completions.create({
          messages,
          model: "mixtral-8x7b-32768",
          temperature,
          top_p,
          max_tokens: maxTokens,
        });
        break;
      }
      case 'openai': {
        const openai = new OpenAI({ apiKey });
        response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages,
          temperature,
          top_p,
          max_tokens: maxTokens,
        });
        break;
      }
      // ... other cases
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    if (!response) {
      throw new Error('No response from AI provider');
    }

    return new Response(JSON.stringify({
      content: response.choices[0].message.content,
    }));

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), { status: 500 });
  }
}