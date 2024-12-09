import OpenAI from "openai";
import { NextResponse } from "next/server";
import { PasswordRequirements, PasswordRules } from "@/lib/types";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || "",
      defaultQuery: { "transform_to_openai": "true" },
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

    const completion = await openai.chat.completions.create({
      model: "google/gemini-pro",
      messages: [
        {
          role: "user",
          content: enhancedPrompt
        }
      ],
      temperature: 0.1,
      top_p: 0.1,
      max_tokens: 1024
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from AI");
    }

    const cleanResponse = response
      .replace(/```(?:json)?\s*/g, '')
      .replace(/```\s*$/g, '')
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/^\s*{\s*/, '{')
      .replace(/\s*}\s*$/, '}')
      .trim();

    try {
      if (!cleanResponse.startsWith('{') || !cleanResponse.endsWith('}')) {
        throw new Error("Invalid JSON format: Response must be a JSON object");
      }

      const parsedRules = JSON.parse(cleanResponse);

      if (!parsedRules || typeof parsedRules !== 'object') {
        throw new Error("Invalid JSON format: Must be an object");
      }

      const rules: PasswordRules = {
        minLength: parsedRules?.minLength || 12,
        maxLength: parsedRules?.maxLength ?? null,
        requiredCharTypes: {
          uppercase: parsedRules?.requiredCharTypes?.uppercase ?? false,
          lowercase: parsedRules?.requiredCharTypes?.lowercase ?? false,
          numbers: parsedRules?.requiredCharTypes?.numbers ?? false,
          symbols: parsedRules?.requiredCharTypes?.symbols ?? false
        },
        excludedChars: parsedRules?.excludedChars || [],
        minCharTypesRequired: parsedRules?.minCharTypesRequired || 3,
        patterns: {
          allowCommonWords: parsedRules?.patterns?.allowCommonWords ?? false,
          allowKeyboardPatterns: parsedRules?.patterns?.allowKeyboardPatterns ?? false,
          allowRepeatingChars: parsedRules?.patterns?.allowRepeatingChars ?? false,
          allowSequentialChars: parsedRules?.patterns?.allowSequentialChars ?? false
        }
      };

      return NextResponse.json({
        rules,
        status: 'success'
      });

    } catch (parseError) {
      console.error('Parse Error:', parseError);
      console.error('Raw Response:', response);
      console.error('Cleaned Response:', cleanResponse);

      return NextResponse.json({
        error: `Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        rawResponse: cleanResponse,
        status: 'error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('PassGenz AI Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "PassGenz AI service failed",
      status: 'error'
    }, { status: 500 });
  }
}
