import { ServiceContext } from './context-analyzer'

export interface PasswordAnalysis {
  entropy: number;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  timeToCrack: string;
  quantumResistant: boolean;
  weaknesses: string[];
  breached?: boolean;
  level?: 'low' | 'medium' | 'high' | 'very-high';
  recommendations?: string[];
}

export interface PasswordOptions {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  memorable: boolean;
  quantumSafe: boolean;
}

export interface GenerationResult {
  password: string;
  analysis: PasswordAnalysis;
}

export interface GeneratorConfig {
  length: number;
  options: PasswordOptions;
  context?: ServiceContext;
}

export interface PasswordMetadata {
  strength: number;
  analysis: {
    entropy: number;
    timeToCrack: string;
    weaknesses: string[];
    breached: boolean;
    breachCount?: number;
    characterDistribution?: Record<string, number>;
    patterns?: string[];
    recommendations?: string[];
  };
  context?: string;
  tags: string[];
}

export interface HistoryMetadata {
  strength: number;
  analysis: {
    entropy: number;
    timeToCrack: string;
    weaknesses: string[];
    breached: boolean;
    breachCount?: number;
    characterDistribution?: Record<string, number>;
    patterns?: string[];
    recommendations?: string[];
  };
  context?: string;
  tags: string[];
}

export interface PasswordRequirements {
  platformType: {
    type: string;
    description: string;
  };
  passwordRules: {
    length: {
      min: number;
      max: number | null;
      description: string;
    };
    characterRequirements: {
      requiredCombinations: {
        count: number;
        from: number;
      };
      allowedCharacterSets: Array<{
        type: string;
        required: boolean;
        description: string;
      }>;
    };
    customConstraints: Array<{
      type: string;
      description: string;
      parameters?: Record<string, any>;
    }>;
  };
  securityAssessment: {
    level: 'low' | 'medium' | 'high' | 'very-high';
    justification: string;
    complianceStandards: string[];
    vulnerabilityWarnings: string[];
  };
  recommendations: {
    implementation: string[];
    userGuidance: string[];
  };
}

export interface PasswordRules {
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