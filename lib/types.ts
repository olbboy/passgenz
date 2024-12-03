import { ServiceContext } from './context-analyzer'

export interface PasswordAnalysis {
  entropy: number;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  timeToCrack: string;
  quantumResistant: boolean;
  weaknesses: string[];
  breached: boolean;
  breachCount?: number;
  characterDistribution?: Record<string, number>;
  patterns?: string[];
  recommendations?: string[];
  level?: 'low' | 'medium' | 'high' | 'very-high';
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