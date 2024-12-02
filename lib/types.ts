import { ServiceContext } from './context-analyzer'

export interface PasswordAnalysis {
  entropy: number;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  timeToCrack: string;
  quantumResistant: boolean;
  weaknesses: string[];
}

export interface PasswordMetadata {
  strength: number;
  analysis: {
    entropy: number;
    timeToCrack: string;
    weaknesses: string[];
    breached?: boolean;
    breachCount?: number;
  };
  context?: string;
  tags?: string[];
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