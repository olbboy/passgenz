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
        count: number | null;
        from: number | null;
      };
      allowedCharacterSets: Array<{
        type: string;
        characters: string | null;
        required: boolean;
        description: string;
      }>;
    };
    historyPolicy: {
      enabled: boolean;
      preventReuse: number | null;
      timeframe: string | null;
    };
    customConstraints: Array<{
      type: string;
      description: string;
      parameters: Record<string, any>;
    }>;
  };
  securityAssessment: {
    level: 'low' | 'medium' | 'high' | 'very-high';
    justification: string;
    complianceStandards: string[];
    securityConsiderations: string[];
    vulnerabilityWarnings: string[];
    strengthAssessment: string;
  };
  recommendations: {
    implementation: string[];
    userGuidance: string[];
    securityEnhancements: string[];
  };
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
    const baseRequirements: PasswordRequirements = {
      platformType: {
        type: 'general',
        description: 'General platform'
      },
      passwordRules: {
        length: {
          min: 12,
          max: null,
          description: '12 characters minimum'
        },
        characterRequirements: {
          requiredCombinations: {
            count: null,
            from: null
          },
          allowedCharacterSets: [
            {
              type: 'uppercase',
              characters: null,
              required: true,
              description: 'Uppercase letters'
            },
            {
              type: 'lowercase',
              characters: null,
              required: true,
              description: 'Lowercase letters'
            },
            {
              type: 'number',
              characters: null,
              required: true,
              description: 'Numbers'
            },
            {
              type: 'symbol',
              characters: null,
              required: true,
              description: 'Symbols'
            }
          ]
        },
        historyPolicy: {
          enabled: false,
          preventReuse: null,
          timeframe: null
        },
        customConstraints: []
      },
      securityAssessment: {
        level: 'medium',
        justification: '',
        complianceStandards: [],
        securityConsiderations: [],
        vulnerabilityWarnings: [],
        strengthAssessment: ''
      },
      recommendations: {
        implementation: [],
        userGuidance: [],
        securityEnhancements: []
      }
    };

    switch (context.securityLevel) {
      case 'high':
        return {
          ...baseRequirements,
          platformType: {
            type: 'financial',
            description: 'Financial platform'
          },
          passwordRules: {
            ...baseRequirements.passwordRules,
            length: {
              ...baseRequirements.passwordRules.length,
              min: Math.max(baseRequirements.passwordRules.length.min, context.requirements?.minLength || 0)
            },
            characterRequirements: {
              ...baseRequirements.passwordRules.characterRequirements,
              allowedCharacterSets: [
                ...baseRequirements.passwordRules.characterRequirements.allowedCharacterSets,
                {
                  type: 'symbol',
                  characters: null,
                  required: true,
                  description: 'Symbols'
                }
              ]
            }
          }
        };

      case 'medium':
        return {
          ...baseRequirements,
          passwordRules: {
            ...baseRequirements.passwordRules,
            length: {
              ...baseRequirements.passwordRules.length,
              min: Math.max(8, context.requirements?.minLength || 0)
            },
            characterRequirements: {
              ...baseRequirements.passwordRules.characterRequirements,
              allowedCharacterSets: [
                ...baseRequirements.passwordRules.characterRequirements.allowedCharacterSets,
                {
                  type: 'symbol',
                  characters: null,
                  required: true,
                  description: 'Symbols'
                }
              ]
            }
          }
        };

      case 'low':
        return {
          ...baseRequirements,
          passwordRules: {
            ...baseRequirements.passwordRules,
            length: {
              ...baseRequirements.passwordRules.length,
              min: Math.max(6, context.requirements?.minLength || 0)
            },
            characterRequirements: {
              ...baseRequirements.passwordRules.characterRequirements,
              allowedCharacterSets: [
                ...baseRequirements.passwordRules.characterRequirements.allowedCharacterSets,
                {
                  type: 'symbol',
                  characters: null,
                  required: true,
                  description: 'Symbols'
                }
              ]
            }
          }
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
    return {
      platformType: {
        type: 'general',
        description: 'General platform'
      },
      passwordRules: {
        length: {
          min: 12,
          max: null,
          description: '12 characters minimum'
        },
        characterRequirements: {
          requiredCombinations: {
            count: null,
            from: null
          },
          allowedCharacterSets: [
            {
              type: 'uppercase',
              characters: null,
              required: true,
              description: 'Uppercase letters'
            },
            {
              type: 'lowercase',
              characters: null,
              required: true,
              description: 'Lowercase letters'
            },
            {
              type: 'number',
              characters: null,
              required: true,
              description: 'Numbers'
            },
            {
              type: 'symbol',
              characters: null,
              required: true,
              description: 'Symbols'
            }
          ]
        },
        historyPolicy: {
          enabled: false,
          preventReuse: null,
          timeframe: null
        },
        customConstraints: []
      },
      securityAssessment: {
        level: 'medium',
        justification: '',
        complianceStandards: [],
        securityConsiderations: [],
        vulnerabilityWarnings: [],
        strengthAssessment: ''
      },
      recommendations: {
        implementation: [],
        userGuidance: [],
        securityEnhancements: []
      }
    };
  }
} 