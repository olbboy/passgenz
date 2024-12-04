import { AllowedCharacterSet } from './types';

export interface ServiceContext {
  type: 'financial' | 'social' | 'email' | 'general';
  domain?: string;
  securityLevel?: 'low' | 'medium' | 'high' | 'very-high';
  requirements: PasswordRequirements;
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
        characters?: string;
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

export class ContextAnalyzer {
  private readonly knownServices = new Map<string, ServiceContext>([
    ['gmail.com', {
      domain: 'gmail.com',
      type: 'email',
      securityLevel: 'high',
      requirements: {
        platformType: {
          type: 'email',
          description: 'Email Service'
        },
        passwordRules: {
          length: {
            min: 8,
            max: null,
            description: '8 characters minimum'
          },
          characterRequirements: {
            requiredCombinations: {
              count: 3,
              from: 4
            },
            allowedCharacterSets: [
              {
                type: 'uppercase',
                required: true,
                description: 'Uppercase letters',
                characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
              },
              {
                type: 'lowercase',
                required: true,
                description: 'Lowercase letters',
                characters: 'abcdefghijklmnopqrstuvwxyz'
              },
              {
                type: 'number',
                required: true,
                description: 'Numbers',
                characters: '0123456789'
              },
              {
                type: 'symbol',
                required: true,
                description: 'Symbols',
                characters: '!@#$%^&*()_+-=[]{}|;:,.<>?'
              }
            ]
          },
          customConstraints: [],
          patterns: {
            allowCommonWords: false,
            allowKeyboardPatterns: false,
            allowRepeatingChars: false,
            allowSequentialChars: false
          }
        },
        securityAssessment: {
          level: 'high',
          justification: 'Email security is critical',
          complianceStandards: [],
          vulnerabilityWarnings: []
        },
        recommendations: {
          implementation: [],
          userGuidance: []
        }
      }
    }],
    ['facebook.com', {
      domain: 'facebook.com', 
      type: 'social',
      securityLevel: 'medium',
      requirements: {
        platformType: {
          type: 'social',
          description: 'Social Media Platform'
        },
        passwordRules: {
          length: {
            min: 6,
            max: null,
            description: '6 characters minimum'
          },
          characterRequirements: {
            requiredCombinations: {
              count: 2,
              from: 4
            },
            allowedCharacterSets: [
              {
                type: 'lowercase',
                required: true,
                description: 'Lowercase letters'
              },
              {
                type: 'number',
                required: true,
                description: 'Numbers'
              }
            ]
          },
          customConstraints: [],
          patterns: {
            allowCommonWords: false,
            allowKeyboardPatterns: false,
            allowRepeatingChars: false,
            allowSequentialChars: false
          }
        },
        securityAssessment: {
          level: 'medium',
          justification: 'Basic security requirements',
          complianceStandards: [],
          vulnerabilityWarnings: []
        },
        recommendations: {
          implementation: [],
          userGuidance: []
        }
      }
    }],
    ['bankofamerica.com', {
      domain: 'bankofamerica.com',
      type: 'financial',
      securityLevel: 'high',
      requirements: {
        platformType: {
          type: 'financial',
          description: 'Banking Platform'
        },
        passwordRules: {
          length: {
            min: 12,
            max: null,
            description: '12 characters minimum'
          },
          characterRequirements: {
            requiredCombinations: {
              count: 4,
              from: 4
            },
            allowedCharacterSets: [
              {
                type: 'uppercase',
                required: true,
                description: 'Uppercase letters',
                characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
              },
              {
                type: 'lowercase',
                required: true,
                description: 'Lowercase letters',
                characters: 'abcdefghijklmnopqrstuvwxyz'
              },
              {
                type: 'number',
                required: true,
                description: 'Numbers',
                characters: '0123456789'
              },
              {
                type: 'symbol',
                required: true,
                description: 'Symbols',
                characters: '!@#$%^&*()_+-=[]{}|;:,.<>?'
              }
            ]
          },
          customConstraints: [
            {
              type: 'excluded-chars',
              description: 'Excluded characters',
              parameters: {
                chars: ['<', '>', '"', "'"]
              }
            }
          ],
          patterns: {
            allowCommonWords: false,
            allowKeyboardPatterns: false,
            allowRepeatingChars: false,
            allowSequentialChars: false
          }
        },
        securityAssessment: {
          level: 'high',
          justification: 'Financial security requirements',
          complianceStandards: [],
          vulnerabilityWarnings: []
        },
        recommendations: {
          implementation: [],
          userGuidance: []
        }
      }
    }]
  ]);

  // Định nghĩa character sets mặc định ở cấp class
  private readonly defaultCharacterSets: AllowedCharacterSet[] = [
    {
      type: 'uppercase',
      required: true,
      description: 'Uppercase letters',
      characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    {
      type: 'lowercase',
      required: true,
      description: 'Lowercase letters',
      characters: 'abcdefghijklmnopqrstuvwxyz'
    },
    {
      type: 'number',
      required: true,
      description: 'Numbers',
      characters: '0123456789'
    },
    {
      type: 'symbol',
      required: true,
      description: 'Symbols',
      characters: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    }
  ];

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
            count: 3,
            from: 4
          },
          allowedCharacterSets: this.defaultCharacterSets
        },
        customConstraints: [],
        patterns: {
          allowCommonWords: false,
          allowKeyboardPatterns: false,
          allowRepeatingChars: false,
          allowSequentialChars: false
        }
      },
      securityAssessment: {
        level: 'medium',
        justification: '',
        complianceStandards: [],
        vulnerabilityWarnings: []
      },
      recommendations: {
        implementation: [],
        userGuidance: []
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
              min: Math.max(
                baseRequirements.passwordRules.length.min,
                context.requirements.passwordRules.length.min
              )
            },
            characterRequirements: {
              ...baseRequirements.passwordRules.characterRequirements,
              allowedCharacterSets: [
                ...this.defaultCharacterSets,
                {
                  type: 'symbol',
                  required: true,
                  description: 'Symbols',
                  characters: '!@#$%^&*()_+-=[]{}|;:,.<>?'
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
              min: Math.max(
                baseRequirements.passwordRules.length.min,
                context.requirements.passwordRules.length.min
              )
            },
            characterRequirements: {
              ...baseRequirements.passwordRules.characterRequirements,
              allowedCharacterSets: [
                ...this.defaultCharacterSets,
                {
                  type: 'symbol',
                  required: true,
                  description: 'Symbols',
                  characters: '!@#$%^&*()_+-=[]{}|;:,.<>?'
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
              min: Math.max(
                baseRequirements.passwordRules.length.min,
                context.requirements.passwordRules.length.min
              )
            },
            characterRequirements: {
              ...baseRequirements.passwordRules.characterRequirements,
              allowedCharacterSets: [
                ...this.defaultCharacterSets,
                {
                  type: 'symbol',
                  required: true,
                  description: 'Symbols',
                  characters: '!@#$%^&*()_+-=[]{}|;:,.<>?'
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

  private getDefaultRequirements(securityLevel: ServiceContext['securityLevel']): PasswordRequirements {
    const baseRequirements: PasswordRequirements = {
      platformType: {
        type: 'general',
        description: 'General Service'
      },
      passwordRules: {
        length: {
          min: 12,
          max: null,
          description: '12 characters minimum'
        },
        characterRequirements: {
          requiredCombinations: {
            count: 3,
            from: 4
          },
          allowedCharacterSets: this.defaultCharacterSets
        },
        customConstraints: [],
        patterns: {
          allowCommonWords: false,
          allowKeyboardPatterns: false,
          allowRepeatingChars: false,
          allowSequentialChars: false
        }
      },
      securityAssessment: {
        level: securityLevel || 'medium',
        justification: '',
        complianceStandards: [],
        vulnerabilityWarnings: []
      },
      recommendations: {
        implementation: [],
        userGuidance: []
      }
    };

    switch (securityLevel) {
      case 'high':
        return {
          ...baseRequirements,
          passwordRules: {
            ...baseRequirements.passwordRules,
            length: {
              ...baseRequirements.passwordRules.length,
              min: 12
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
              min: 8
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
              min: 6
            }
          }
        };
      default:
        return baseRequirements;
    }
  }

  analyzeFromText(text: string): PasswordRequirements {
    return this.getDefaultRequirements('medium');
  }
} 