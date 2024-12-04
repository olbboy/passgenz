export interface PasswordAnalysis {
  entropy: number;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  timeToCrack: string;
  quantumResistant: boolean;
  weaknesses: string[];
  breached?: boolean;
  level?: 'low' | 'medium' | 'high' | 'very-high';
  recommendations?: string[];
  patterns?: {
    hasCommonWords: boolean;
    hasKeyboardPatterns: boolean;
    hasRepeatingChars: boolean;
    hasSequentialChars: boolean;
  };
  characterDistribution?: {
    uppercase: number;
    lowercase: number;
    numbers: number;
    symbols: number;
  };
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
  mode: 'basic' | 'context' | 'pattern' | 'memorable';
  length: number;
  options: PasswordOptions;
  context?: ServiceContext;
  memorableOptions?: {
    wordCount: number;
    capitalize: boolean;
    includeNumbers: boolean;
    includeSeparators: boolean;
  };
  pattern?: string;
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
    patterns?: {
      hasCommonWords: boolean;
      hasKeyboardPatterns: boolean;
      hasRepeatingChars: boolean;
      hasSequentialChars: boolean;
    };
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
    patterns?: {
      hasCommonWords: boolean;
      hasKeyboardPatterns: boolean;
      hasRepeatingChars: boolean;
      hasSequentialChars: boolean;
    };
    recommendations?: string[];
  };
  context?: string;
  tags: string[];
  favorite?: boolean;
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
    patterns: {
      allowCommonWords: boolean;
      allowKeyboardPatterns: boolean;
      allowRepeatingChars: boolean;
      allowSequentialChars: boolean;
    };
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

export interface ServiceContext {
  type: 'financial' | 'social' | 'email' | 'general';
  domain?: string;
  securityLevel?: 'low' | 'medium' | 'high' | 'very-high';
  requirements: PasswordRequirements;
} 