import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { PasswordRequirements, PasswordRules } from "@/lib/types";

export const runtime = 'edge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.1,
        topP: 0.1,
        topK: 16,
        maxOutputTokens: 1024,
      },
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

    const result = await model.generateContent(enhancedPrompt);
    if (!result.response) {
      throw new Error("No response from AI");
    }

    const response = await result.response.text();
    
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