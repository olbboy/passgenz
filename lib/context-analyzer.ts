export interface ServiceContext {
  domain: string;
  type: 'financial' | 'social' | 'email' | 'general';
  securityLevel: 'high' | 'medium' | 'low';
  requirements?: {
    minLength?: number;
    requiredChars?: string[];
    maxLength?: number;
    excludedChars?: string[];
  };
}

export interface PasswordRequirements {
  minLength: number;
  maxLength?: number;
  requiredChars: ('uppercase' | 'lowercase' | 'number' | 'symbol')[];
  excludedChars?: string[];
  securityLevel: 'high' | 'medium' | 'low';
}

export class ContextAnalyzer {
  private readonly knownServices = new Map<string, ServiceContext>([
    ['gmail.com', {
      domain: 'gmail.com',
      type: 'email',
      securityLevel: 'high',
      requirements: {
        minLength: 8,
        requiredChars: ['uppercase', 'lowercase', 'number']
      }
    }],
    ['facebook.com', {
      domain: 'facebook.com', 
      type: 'social',
      securityLevel: 'medium',
      requirements: {
        minLength: 6,
        requiredChars: ['lowercase', 'number']
      }
    }],
    ['bankofamerica.com', {
      domain: 'bankofamerica.com',
      type: 'financial',
      securityLevel: 'high',
      requirements: {
        minLength: 12,
        requiredChars: ['uppercase', 'lowercase', 'number', 'symbol'],
        excludedChars: ['<', '>', '"', "'"]
      }
    }]
  ]);

  analyzeContext(url: string): ServiceContext {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Check known services
      for (const [serviceDomain, context] of this.knownServices) {
        if (domain.includes(serviceDomain)) {
          return context;
        }
      }

      // Analyze unknown service
      const securityLevel = this.analyzeSecurityLevel(domain);
      const type = this.analyzeServiceType(domain);

      return {
        domain,
        type,
        securityLevel,
        requirements: this.getDefaultRequirements(securityLevel)
      };
    } catch {
      // Invalid URL, return general context
      return {
        domain: 'unknown',
        type: 'general',
        securityLevel: 'medium',
        requirements: this.getDefaultRequirements('medium')
      };
    }
  }

  suggestRequirements(context: ServiceContext): PasswordRequirements {
    const baseRequirements = {
      minLength: 12,
      securityLevel: 'medium' as const,
      requiredChars: ['uppercase', 'lowercase', 'number', 'symbol'] as Array<'uppercase' | 'lowercase' | 'number' | 'symbol'>
    };

    switch (context.securityLevel) {
      case 'high':
        return {
          ...baseRequirements,
          minLength: Math.max(baseRequirements.minLength, context.requirements?.minLength || 0),
          securityLevel: 'high',
          requiredChars: ['uppercase', 'lowercase', 'number', 'symbol'],
          excludedChars: context.requirements?.excludedChars
        };

      case 'medium':
        return {
          ...baseRequirements,
          minLength: Math.max(8, context.requirements?.minLength || 0),
          securityLevel: 'medium',
          requiredChars: ['uppercase', 'lowercase', 'number']
        };

      case 'low':
        return {
          ...baseRequirements,
          minLength: Math.max(6, context.requirements?.minLength || 0),
          securityLevel: 'low',
          requiredChars: ['lowercase', 'number']
        };

      default:
        return baseRequirements;
    }
  }

  private analyzeSecurityLevel(domain: string): ServiceContext['securityLevel'] {
    if (domain.includes('bank') || domain.includes('finance') || domain.includes('crypto')) {
      return 'high';
    }
    if (domain.includes('mail') || domain.includes('social')) {
      return 'medium'; 
    }
    return 'low';
  }

  private analyzeServiceType(domain: string): ServiceContext['type'] {
    if (domain.includes('mail')) return 'email';
    if (domain.includes('bank') || domain.includes('pay')) return 'financial';
    if (domain.includes('social') || domain.includes('facebook')) return 'social';
    return 'general';
  }

  private getDefaultRequirements(securityLevel: ServiceContext['securityLevel']) {
    switch (securityLevel) {
      case 'high':
        return {
          minLength: 12,
          requiredChars: ['uppercase', 'lowercase', 'number', 'symbol']
        };
      case 'medium':
        return {
          minLength: 8,
          requiredChars: ['uppercase', 'lowercase', 'number']
        };
      case 'low':
        return {
          minLength: 6,
          requiredChars: ['lowercase', 'number']
        };
    }
  }

  analyzeFromText(text: string): PasswordRequirements {
    const requirements: PasswordRequirements = {
      minLength: 12,
      requiredChars: ['lowercase'],
      excludedChars: [],
      securityLevel: 'medium'
    };

    const lowercaseText = text.toLowerCase();

    // Analyze security level
    if (lowercaseText.includes('strong') || lowercaseText.includes('secure')) {
      requirements.securityLevel = 'high';
      requirements.minLength = 16;
      requirements.requiredChars = ['uppercase', 'lowercase', 'number', 'symbol'];
    } else if (lowercaseText.includes('basic') || lowercaseText.includes('simple')) {
      requirements.securityLevel = 'low';
      requirements.minLength = 8;
      requirements.requiredChars = ['lowercase', 'number'];
    }

    // Extract specific requirements
    if (lowercaseText.includes('uppercase')) {
      requirements.requiredChars.push('uppercase');
    }
    if (lowercaseText.includes('number')) {
      requirements.requiredChars.push('number');
    }
    if (lowercaseText.includes('symbol')) {
      requirements.requiredChars.push('symbol');
    }

    return requirements;
  }
} 