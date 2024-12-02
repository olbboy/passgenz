export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  prohibitedCharacters?: string[];
  expiryDays?: number;
  preventReuse?: boolean;
  requireQuantumSafe?: boolean;
}

export class PolicyManager {
  private readonly policies: Map<string, PasswordPolicy> = new Map([
    ['default', {
      minLength: 12,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      requireQuantumSafe: true
    }],
    ['high-security', {
      minLength: 16,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSymbols: true,
      preventReuse: true,
      requireQuantumSafe: true,
      expiryDays: 90
    }]
  ]);

  getPolicy(name: string = 'default'): PasswordPolicy {
    return this.policies.get(name) || this.policies.get('default')!;
  }

  validatePassword(password: string, policy: PasswordPolicy): boolean {
    if (password.length < policy.minLength || password.length > policy.maxLength) {
      return false;
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) return false;
    if (policy.requireLowercase && !/[a-z]/.test(password)) return false;
    if (policy.requireNumbers && !/[0-9]/.test(password)) return false;
    if (policy.requireSymbols && !/[^A-Za-z0-9]/.test(password)) return false;

    if (policy.prohibitedCharacters) {
      if (policy.prohibitedCharacters.some(char => password.includes(char))) {
        return false;
      }
    }

    return true;
  }
} 