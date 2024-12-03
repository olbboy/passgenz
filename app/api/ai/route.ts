import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Define platform types
type PlatformType = 'banking' | 'social' | 'email' | 'enterprise' | 'general';
type SecurityLevel = 'low' | 'medium' | 'high' | 'very-high';
type CharacterType = 'uppercase' | 'lowercase' | 'number' | 'symbol';

// Define template interface
interface SecurityTemplate {
  minLength: number;
  maxLength: number;
  requiredChars: CharacterType[];
  excludedChars: string[];
  complianceStandards: string[];
  securityLevel: SecurityLevel;
}

// Define templates object with proper typing
const securityTemplates: Record<PlatformType, SecurityTemplate> = {
  banking: {
    minLength: 12,
    maxLength: 64,
    requiredChars: ['uppercase', 'lowercase', 'number', 'symbol'],
    excludedChars: ['<', '>', '"', "'", ' '],
    complianceStandards: ['PCI DSS', 'NIST SP 800-63B'],
    securityLevel: 'very-high'
  },
  social: {
    minLength: 8,
    maxLength: 64,
    requiredChars: ['uppercase', 'lowercase', 'number'],
    excludedChars: ['<', '>', '"', "'"],
    complianceStandards: ['NIST SP 800-63B'],
    securityLevel: 'medium'
  },
  email: {
    minLength: 10,
    maxLength: 64,
    requiredChars: ['uppercase', 'lowercase', 'number'],
    excludedChars: ['<', '>', '"', "'"],
    complianceStandards: ['NIST SP 800-63B'],
    securityLevel: 'medium'
  },
  enterprise: {
    minLength: 14,
    maxLength: 128,
    requiredChars: ['uppercase', 'lowercase', 'number', 'symbol'],
    excludedChars: ['<', '>', '"', "'", ' '],
    complianceStandards: ['NIST SP 800-63B', 'ISO 27001'],
    securityLevel: 'very-high'
  },
  general: {
    minLength: 8,
    maxLength: 64,
    requiredChars: ['uppercase', 'lowercase', 'number'],
    excludedChars: ['<', '>', '"', "'"],
    complianceStandards: ['NIST SP 800-63B'],
    securityLevel: 'medium'
  }
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 4096,
      },
    });

    const enhancedPrompt = 
    `Analyze this context and provide password requirements in JSON format.
    Context: ${prompt}

    IMPORTANT: 
    1. Return ONLY a valid JSON object
    2. DO NOT include markdown code blocks
    3. DO NOT include any explanatory text
    4. Ensure the JSON has this exact structure:

    {
      "platformType": {
        "type": "banking|social|email|enterprise|general",
        "description": "string"
      },
      "passwordRules": {
        "length": {
          "min": 8,
          "max": 64,
          "description": "string"
        },
        "characterRequirements": {
          "requiredCombinations": {
            "count": 3,
            "from": 4
          },
          "allowedCharacterSets": [
            {
              "type": "uppercase|lowercase|number|symbol",
              "required": true,
              "description": "string"
            }
          ]
        },
        "customConstraints": []
      },
      "securityAssessment": {
        "level": "low|medium|high|very-high",
        "justification": "string",
        "complianceStandards": [],
        "vulnerabilityWarnings": []
      },
      "recommendations": {
        "implementation": [],
        "userGuidance": []
      }
    }

    Note: Replace placeholders with actual values based on context.`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response.text();
    
    // Clean up response
    const cleanResponse = response
      .replace(/```(?:json)?\s*/g, '')  // Remove opening ```json or ```
      .replace(/```\s*$/g, '')          // Remove closing ```
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .trim();

    try {
      // Parse and validate JSON
      const aiResponse = JSON.parse(cleanResponse);
      const platformType = (aiResponse.platformType?.type || 'general') as PlatformType;
      
      // Apply template based on platform type
      const template = securityTemplates[platformType];
      
      // Merge AI insights with template
      const enhancedResponse = {
        ...aiResponse,
        passwordRules: {
          ...aiResponse.passwordRules,
          length: {
            min: Math.max(aiResponse.passwordRules?.length?.min || 8, template.minLength),
            max: template.maxLength,
            description: aiResponse.passwordRules?.length?.description || 'Password length requirements'
          },
          characterRequirements: {
            ...aiResponse.passwordRules?.characterRequirements,
            allowedCharacterSets: template.requiredChars.map((charType: CharacterType) => ({
              type: charType,
              required: true,
              description: `Must include ${charType} characters`
            }))
          },
          customConstraints: [
            ...(aiResponse.passwordRules?.customConstraints || []),
            {
              type: 'excluded-chars',
              description: 'Characters not allowed in password',
              parameters: { chars: template.excludedChars }
            }
          ]
        },
        securityAssessment: {
          ...aiResponse.securityAssessment,
          complianceStandards: [
            ...new Set([
              ...template.complianceStandards,
              ...(aiResponse.securityAssessment?.complianceStandards || [])
            ])
          ],
          level: template.securityLevel
        }
      };

      return NextResponse.json({ 
        response: JSON.stringify(enhancedResponse),
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
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to analyze requirements",
      status: 'error'
    }, { status: 500 });
  }
}