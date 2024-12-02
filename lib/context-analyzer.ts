export interface ServiceContext {
  name?: string;
  url?: string;
  type?: 'web' | 'mobile' | 'desktop' | 'api';
  requirements?: {
    minLength?: number;
    maxLength?: number;
    requiredChars?: string[];
    forbiddenChars?: string[];
    patterns?: RegExp[];
  };
}

export interface PasswordRequirements {
  minLength: number;
  maxLength: number;
  requiredChars: string[];
}

export class ContextAnalyzer {
  private readonly knownServices: Map<string, ServiceContext> = new Map([
    ['google.com', {
      type: 'web',
      requirements: {
        minLength: 8,
        requiredChars: ['uppercase', 'lowercase', 'number']
      }
    }],
    ['github.com', {
      type: 'web',
      requirements: {
        minLength: 8,
        requiredChars: ['uppercase', 'lowercase', 'number', 'symbol']
      }
    }]
  ]);

  analyzeContext(url?: string): ServiceContext {
    if (!url) return {};
    
    const domain = new URL(url).hostname;
    return this.knownServices.get(domain) || {};
  }

  suggestRequirements(context: ServiceContext): PasswordRequirements {
    // Implement context-based requirement suggestions
    return {
      minLength: context.requirements?.minLength || 12,
      maxLength: context.requirements?.maxLength || 128,
      requiredChars: context.requirements?.requiredChars || ['uppercase', 'lowercase', 'number', 'symbol']
    };
  }
} 