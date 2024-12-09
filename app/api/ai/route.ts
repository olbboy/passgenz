import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from "next/server";
import { PasswordRequirements, PasswordRules } from "@/lib/types";

export const runtime = 'edge';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  tokenLimit: number;
  defaultParameters: ModelParameters;
}

interface ModelParameters {
  temperature: number;
  top_p: number;
  max_tokens: number;
}

// Available models configuration
const AVAILABLE_MODELS: AIModel[] = [
  {
    id: "google/gemini-pro",
    name: "Gemini Pro",
    provider: "google",
    contextWindow: 32000,
    tokenLimit: 2048,
    defaultParameters: {
      temperature: 0.1,
      top_p: 0.1,
      max_tokens: 1024
    }
  },
  {
    id: "anthropic/claude-2",
    name: "Claude 2",
    provider: "anthropic",
    contextWindow: 100000,
    tokenLimit: 4096,
    defaultParameters: {
      temperature: 0.1,
      top_p: 0.1,
      max_tokens: 1024
    }
  },
  {
    id: "meta/llama-2-70b-chat",
    name: "Llama 2 70B",
    provider: "meta",
    contextWindow: 4096,
    tokenLimit: 2048,
    defaultParameters: {
      temperature: 0.1,
      top_p: 0.1,
      max_tokens: 1024
    }
  }
];

export async function POST(request: Request) {
  try {
    const { prompt, modelId = "google/gemini-pro" } = await request.json();

    // Find selected model configuration
    const selectedModel = AVAILABLE_MODELS.find(model => model.id === modelId);
    if (!selectedModel) {
      throw new Error(`Invalid model ID: ${modelId}`);
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || "",
      defaultQuery: { transform_to_openai: "true" },
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "PassGenz",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`
      }
    });

    const enhancedPrompt = `You are a JSON generator. Your task is to convert password requirements into a specific JSON format.

Input: ${prompt}

Rules:
1. Return ONLY valid JSON
2. NO explanatory text
3. NO code blocks or markdown
4. EXACT structure as shown below:

{
  "minLength": 12,
  "maxLength": 64,
  "requiredCharTypes": {
    "uppercase": true,
    "lowercase": true,
    "numbers": true,
    "symbols": true
  },
  "excludedChars": [],
  "minCharTypesRequired": 3,
  "patterns": {
    "allowCommonWords": false,
    "allowKeyboardPatterns": false,
    "allowRepeatingChars": false,
    "allowSequentialChars": false
  }
}`;

    const response = await openai.chat.completions.create({
      model: selectedModel.id,
      messages: [
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
      ...selectedModel.defaultParameters,
      stream: true
    });

    // Create a stream from the response
    const stream = OpenAIStream(response);

    // Return the stream response
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error('PassGenz AI Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "PassGenz AI service failed",
      status: 'error'
    }, { status: 500 });
  }
}
