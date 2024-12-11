import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { PasswordRequirements, PasswordRules } from "@/lib/types";
import { generatePatternFromRequirements } from "@/lib/utils";
import Groq from 'groq-sdk';

// Add interfaces for type safety
interface CharacterSet {
  type: string;
  required: boolean;
}

interface Constraint {
  type: string;
  parameters?: {
    chars?: string[];
  };
}

// Hàm lấy API key với xử lý lỗi
function getApiKey(provider: string, userApiKey?: string): string {
  const envKey = process.env[`${provider.toUpperCase()}_API_KEY`];
  const key = userApiKey || envKey;
  
  if (!key) {
    throw new Error(`Không tìm thấy API key cho provider: ${provider}`);
  }
  
  return key;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { requirements } = await request.json();

    // Convert PasswordRequirements to PasswordRules directly
    const rules: PasswordRules = {
      minLength: requirements.passwordRules.length.min,
      maxLength: requirements.passwordRules.length.max,
      requiredCharTypes: {
        uppercase: requirements.passwordRules.characterRequirements.allowedCharacterSets
          .some((set: CharacterSet) => set.type === 'uppercase' && set.required),
        lowercase: requirements.passwordRules.characterRequirements.allowedCharacterSets
          .some((set: CharacterSet) => set.type === 'lowercase' && set.required),
        numbers: requirements.passwordRules.characterRequirements.allowedCharacterSets
          .some((set: CharacterSet) => set.type === 'number' && set.required),
        symbols: requirements.passwordRules.characterRequirements.allowedCharacterSets
          .some((set: CharacterSet) => set.type === 'symbol' && set.required)
      },
      excludedChars: requirements.passwordRules.customConstraints
        .filter((constraint: Constraint) => constraint.type === 'excluded-chars')
        .flatMap((constraint: Constraint) => constraint.parameters?.chars || []),
      minCharTypesRequired: requirements.passwordRules.characterRequirements.requiredCombinations.count,
      patterns: {
        // Set patterns based on security level
        allowCommonWords: requirements.securityAssessment.level === 'low',
        allowKeyboardPatterns: requirements.securityAssessment.level === 'low',
        allowRepeatingChars: requirements.securityAssessment.level !== 'very-high',
        allowSequentialChars: requirements.securityAssessment.level === 'low'
      }
    };

    return NextResponse.json({ 
      rules,
      status: 'success'
    });

  } catch (error) {
    console.error('PassGenz Rules Generation Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "PassGenz failed to generate rules",
      status: 'error'
    }, { status: 500 });
  }
} 