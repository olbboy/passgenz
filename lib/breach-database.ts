export class BreachDatabase {
  private static instance: BreachDatabase;
  private readonly API_KEY = process.env.NEXT_PUBLIC_HIBP_API_KEY;
  private readonly API_URL = 'https://api.pwnedpasswords.com/range/';

  static getInstance(): BreachDatabase {
    if (!BreachDatabase.instance) {
      BreachDatabase.instance = new BreachDatabase();
    }
    return BreachDatabase.instance;
  }

  async checkPassword(password: string): Promise<{
    breached: boolean;
    count?: number;
  }> {
    try {
      const hash = await this.sha1(password);
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5).toUpperCase();

      const response = await fetch(`${this.API_URL}${prefix}`);
      const data = await response.text();

      const hashes = data.split('\n');
      const match = hashes.find(h => h.split(':')[0] === suffix);

      if (match) {
        const count = parseInt(match.split(':')[1]);
        return { breached: true, count };
      }

      return { breached: false };
    } catch (error) {
      console.error('Failed to check breach database:', error);
      return { breached: false };
    }
  }

  private async sha1(str: string): Promise<string> {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
} 