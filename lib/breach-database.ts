export interface BreachCheckResult {
  isBreached: boolean;
  breachCount: number;
  lastBreachDate?: Date;
  sources?: string[];
}

export class BreachDatabaseService {
  private static instance: BreachDatabaseService;
  private readonly API_ENDPOINT = 'https://api.haveibeenpwned.com/v3';
  private readonly API_KEY: string;

  private constructor(apiKey: string) {
    this.API_KEY = apiKey;
  }

  static getInstance(apiKey?: string): BreachDatabaseService {
    if (!BreachDatabaseService.instance) {
      if (!apiKey) {
        throw new Error('API key is required for first initialization');
      }
      BreachDatabaseService.instance = new BreachDatabaseService(apiKey);
    }
    return BreachDatabaseService.instance;
  }

  async checkPassword(password: string): Promise<BreachCheckResult> {
    const hash = await this.hashPassword(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    try {
      const response = await fetch(
        `${this.API_ENDPOINT}/range/${prefix}`,
        {
          headers: {
            'hibp-api-key': this.API_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to check breach database');
      }

      const data = await response.text();
      const matches = data.split('\n')
        .map(line => line.split(':'))
        .filter(([hashSuffix]) => hashSuffix.toLowerCase() === suffix.toLowerCase());

      return {
        isBreached: matches.length > 0,
        breachCount: matches.length ? parseInt(matches[0][1], 10) : 0,
        lastBreachDate: matches.length ? new Date() : undefined,
        sources: matches.map(m => m[2]).filter(Boolean)
      };
    } catch (error) {
      console.error('Breach check failed:', error);
      return {
        isBreached: false,
        breachCount: 0
      };
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-1', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }
} 