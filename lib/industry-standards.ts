export interface PINStandard {
  industry: string;
  name: string;
  requirements: {
    minLength: number;
    maxLength: number;
    allowedCharacters: string[];
    format?: RegExp;
    expiryDays?: number;
    allowReuse?: boolean;
  };
}

export class IndustryStandardsService {
  private static instance: IndustryStandardsService;
  private readonly standards: Map<string, PINStandard> = new Map([
    ['banking', {
      industry: 'banking',
      name: 'Banking PIN Standard',
      requirements: {
        minLength: 4,
        maxLength: 6,
        allowedCharacters: ['0-9'],
        expiryDays: 90,
        allowReuse: false
      }
    }],
    ['mobile', {
      industry: 'mobile',
      name: 'Mobile Device PIN',
      requirements: {
        minLength: 6,
        maxLength: 12,
        allowedCharacters: ['0-9', 'A-Z'],
        format: /^[0-9A-Z]{6,12}$/
      }
    }],
    ['access-control', {
      industry: 'access-control',
      name: 'Physical Access Control',
      requirements: {
        minLength: 6,
        maxLength: 8,
        allowedCharacters: ['0-9'],
        expiryDays: 30
      }
    }]
  ]);

  static getInstance(): IndustryStandardsService {
    if (!IndustryStandardsService.instance) {
      IndustryStandardsService.instance = new IndustryStandardsService();
    }
    return IndustryStandardsService.instance;
  }

  getStandard(industry: string): PINStandard | undefined {
    return this.standards.get(industry);
  }

  validatePIN(pin: string, industry: string): {
    valid: boolean;
    violations: string[];
  } {
    const standard = this.standards.get(industry);
    if (!standard) {
      throw new Error(`Unknown industry standard: ${industry}`);
    }

    const violations: string[] = [];

    if (pin.length < standard.requirements.minLength) {
      violations.push(`PIN must be at least ${standard.requirements.minLength} characters`);
    }

    if (pin.length > standard.requirements.maxLength) {
      violations.push(`PIN must not exceed ${standard.requirements.maxLength} characters`);
    }

    if (standard.requirements.format && !standard.requirements.format.test(pin)) {
      violations.push('PIN format is invalid');
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
} 