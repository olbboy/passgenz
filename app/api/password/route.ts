import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { PasswordRequirements } from "@/lib/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface PasswordRules {
  minLength: number;
  maxLength: number | null;
  requiredCharTypes: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
  excludedChars: string[];
  minCharTypesRequired: number;
  patterns: {
    allowCommonWords: boolean;
    allowKeyboardPatterns: boolean;
    allowRepeatingChars: boolean;
    allowSequentialChars: boolean;
  };
}

export async function POST(request: Request) {
  try {
    const { requirements } = await request.json();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
      },
    });

    const prompt = `Convert these password requirements into specific rules:

Platform: ${requirements.platformType.type}
Security Level: ${requirements.securityAssessment.level}
Requirements: ${JSON.stringify(requirements.passwordRules, null, 2)}

Return ONLY a JSON object with these exact fields:
{
  "minLength": number,
  "maxLength": number | null,
  "requiredCharTypes": {
    "uppercase": boolean,
    "lowercase": boolean,
    "numbers": boolean,
    "symbols": boolean
  },
  "excludedChars": string[],
  "minCharTypesRequired": number,
  "patterns": {
    "allowCommonWords": boolean,
    "allowKeyboardPatterns": boolean,
    "allowRepeatingChars": boolean,
    "allowSequentialChars": boolean
  }
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    // Parse and validate rules
    const rules: PasswordRules = JSON.parse(response);

    return NextResponse.json({ 
      rules,
      status: 'success'
    });

  } catch (error) {
    console.error('Rules Generation Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to generate rules",
      status: 'error'
    }, { status: 500 });
  }
} 