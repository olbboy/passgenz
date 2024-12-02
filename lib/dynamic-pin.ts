export interface DynamicPINConfig {
  type: 'time-based' | 'counter-based' | 'challenge-response';
  length: number;
  validityPeriod?: number; // seconds
  algorithm?: 'sha1' | 'sha256' | 'sha512';
  secret?: string;
}

export class DynamicPINService {
  private static instance: DynamicPINService;
  private readonly secrets: Map<string, string> = new Map();

  static getInstance(): DynamicPINService {
    if (!DynamicPINService.instance) {
      DynamicPINService.instance = new DynamicPINService();
    }
    return DynamicPINService.instance;
  }

  async generateDynamicPIN(config: DynamicPINConfig): Promise<{
    pin: string;
    validUntil?: Date;
    counter?: number;
  }> {
    switch (config.type) {
      case 'time-based':
        return this.generateTOTP(config);
      case 'counter-based':
        return this.generateHOTP(config);
      case 'challenge-response':
        return this.generateChallengeResponse(config);
      default:
        throw new Error(`Unsupported PIN type: ${config.type}`);
    }
  }

  private async generateTOTP(config: DynamicPINConfig) {
    const timeStep = config.validityPeriod || 30;
    const counter = Math.floor(Date.now() / 1000 / timeStep);
    const validUntil = new Date((counter + 1) * timeStep * 1000);

    return {
      pin: await this.generatePINFromCounter(counter, config),
      validUntil
    };
  }

  private async generateHOTP(config: DynamicPINConfig) {
    const counter = Date.now();
    return {
      pin: await this.generatePINFromCounter(counter, config),
      counter
    };
  }

  private async generateChallengeResponse(config: DynamicPINConfig) {
    const challenge = crypto.randomUUID();
    const pin = await this.generatePINFromChallenge(challenge, config);
    return { pin, challenge };
  }

  private async generatePINFromCounter(counter: number, config: DynamicPINConfig): Promise<string> {
    const data = new Uint8Array(8);
    new DataView(data.buffer).setBigUint64(0, BigInt(counter));
    return this.generatePINFromData(data, config);
  }

  private async generatePINFromChallenge(challenge: string, config: DynamicPINConfig): Promise<string> {
    const data = new TextEncoder().encode(challenge);
    return this.generatePINFromData(data, config);
  }

  private async generatePINFromData(data: Uint8Array, config: DynamicPINConfig): Promise<string> {
    const key = await this.getOrGenerateSecret(config);
    const hmac = await this.calculateHMAC(data, key, config.algorithm || 'sha1');
    
    // Generate PIN from HMAC
    const offset = hmac[hmac.length - 1] & 0xf;
    const binary = ((hmac[offset] & 0x7f) << 24) |
                  ((hmac[offset + 1] & 0xff) << 16) |
                  ((hmac[offset + 2] & 0xff) << 8) |
                  (hmac[offset + 3] & 0xff);

    const pin = binary % Math.pow(10, config.length);
    return pin.toString().padStart(config.length, '0');
  }

  private async getOrGenerateSecret(config: DynamicPINConfig): Promise<string> {
    if (config.secret) {
      return config.secret;
    }

    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async calculateHMAC(data: Uint8Array, key: string, algorithm: string): Promise<Uint8Array> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      { name: 'HMAC', hash: algorithm.toUpperCase() },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      data
    );

    return new Uint8Array(signature);
  }
} 