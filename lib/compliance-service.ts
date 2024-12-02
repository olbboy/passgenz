export interface ComplianceRequirement {
  name: string;
  standard: 'NIST' | 'FIPS' | 'ISO' | 'GDPR' | 'HIPAA';
  requirements: {
    minLength: number;
    complexity: boolean;
    expiryDays: number;
    historyCount: number;
    requireMFA: boolean;
  };
}

export class ComplianceService {
  private static instance: ComplianceService;
  private readonly requirements: Map<string, ComplianceRequirement> = new Map([
    ['NIST-800-63B', {
      name: 'NIST 800-63B',
      standard: 'NIST',
      requirements: {
        minLength: 8,
        complexity: false,
        expiryDays: 0, // NIST recommends against password expiration
        historyCount: 0,
        requireMFA: true
      }
    }],
    ['HIPAA', {
      name: 'HIPAA Security Rule',
      standard: 'HIPAA',
      requirements: {
        minLength: 12,
        complexity: true,
        expiryDays: 90,
        historyCount: 6,
        requireMFA: true
      }
    }]
  ]);

  static getInstance(): ComplianceService {
    if (!ComplianceService.instance) {
      ComplianceService.instance = new ComplianceService();
    }
    return ComplianceService.instance;
  }

  checkCompliance(password: string, standard: string): {
    compliant: boolean;
    violations: string[];
  } {
    const req = this.requirements.get(standard);
    if (!req) {
      throw new Error(`Unknown compliance standard: ${standard}`);
    }

    const violations: string[] = [];
    
    if (password.length < req.requirements.minLength) {
      violations.push(`Length must be at least ${req.requirements.minLength} characters`);
    }

    if (req.requirements.complexity) {
      if (!/[A-Z]/.test(password)) violations.push('Must contain uppercase letters');
      if (!/[a-z]/.test(password)) violations.push('Must contain lowercase letters');
      if (!/[0-9]/.test(password)) violations.push('Must contain numbers');
      if (!/[^A-Za-z0-9]/.test(password)) violations.push('Must contain special characters');
    }

    return {
      compliant: violations.length === 0,
      violations
    };
  }
} 