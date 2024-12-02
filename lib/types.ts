import { ServiceContext } from './context-analyzer'

export interface PasswordAnalysis {
  entropy: number;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  timeToCrack: string;
  quantumResistant: boolean;
  weaknesses: string[];
  breached?: boolean;
  breachCount?: number;
  patterns?: {
    hasCommonWords: boolean;
    hasKeyboardPatterns: boolean;
    hasRepeatingChars: boolean;
    hasSequentialChars: boolean;
  };
  recommendations?: string[];
}

export interface PasswordMetadata {
  strength: number;
  analysis: {
    entropy: number;
    timeToCrack: string;
    weaknesses: string[];
    breached?: boolean;
    breachCount?: number;
    characterDistribution?: {
      uppercase: number;
      lowercase: number;
      numbers: number;
      symbols: number;
    };
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

export interface GeneratorConfig {
  length: number;
  options: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    memorable?: boolean;
    quantumSafe?: boolean;
  };
  context?: ServiceContext;
}

export interface GenerationResult {
  password: string;
  analysis: PasswordAnalysis;
}

export interface PasswordOptions {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  memorable: boolean;
  quantumSafe: boolean;
}

export interface HistoryMetadata {
  strength: number;
  analysis: {
    entropy: number;
    timeToCrack: string;
    weaknesses: string[];
    breached?: boolean;
    breachCount?: number;
    characterDistribution?: {
      uppercase: number;
      lowercase: number;
      numbers: number;
      symbols: number;
    };
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