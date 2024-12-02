export type AlgorithmType = 
  | 'AES'
  | 'RSA'
  | 'ECC'
  | 'ChaCha20'
  | 'Kyber'  // Post-quantum
  | 'Dilithium' // Post-quantum
  | 'Custom';

export interface AlgorithmConfig {
  type: AlgorithmType;
  keySize: number;
  mode?: string;
  padding?: string;
  params?: Record<string, any>;
}

export class CryptoAlgorithmService {
  private static instance: CryptoAlgorithmService;
  private readonly algorithms: Map<AlgorithmType, (config: AlgorithmConfig) => Promise<CryptoKey>> = new Map();

  private constructor() {
    this.registerAlgorithms();
  }

  static getInstance(): CryptoAlgorithmService {
    if (!CryptoAlgorithmService.instance) {
      CryptoAlgorithmService.instance = new CryptoAlgorithmService();
    }
    return CryptoAlgorithmService.instance;
  }

  private registerAlgorithms() {
    this.algorithms.set('AES', this.generateAESKey.bind(this));
    this.algorithms.set('RSA', this.generateRSAKey.bind(this));
    this.algorithms.set('ECC', this.generateECCKey.bind(this));
    this.algorithms.set('ChaCha20', this.generateChaCha20Key.bind(this));
    this.algorithms.set('Kyber', this.generateKyberKey.bind(this));
    this.algorithms.set('Dilithium', this.generateDilithiumKey.bind(this));
  }

  async generateKey(config: AlgorithmConfig): Promise<CryptoKey> {
    const generator = this.algorithms.get(config.type);
    if (!generator) {
      throw new Error(`Unsupported algorithm: ${config.type}`);
    }
    return generator(config);
  }

  private async generateAESKey(config: AlgorithmConfig): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: config.keySize
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async generateRSAKey(config: AlgorithmConfig): Promise<CryptoKey> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: config.keySize,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );
    return keyPair.privateKey;
  }

  private async generateECCKey(config: AlgorithmConfig): Promise<CryptoKey> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: config.params?.curve || 'P-256'
      },
      true,
      ['sign', 'verify']
    );
    return keyPair.privateKey;
  }

  private async generateChaCha20Key(config: AlgorithmConfig): Promise<CryptoKey> {
    // Implement ChaCha20 key generation
    throw new Error('ChaCha20 not implemented');
  }

  private async generateKyberKey(config: AlgorithmConfig): Promise<CryptoKey> {
    // Implement Kyber (post-quantum) key generation
    throw new Error('Kyber not implemented');
  }

  private async generateDilithiumKey(config: AlgorithmConfig): Promise<CryptoKey> {
    // Implement Dilithium (post-quantum) key generation
    throw new Error('Dilithium not implemented');
  }
} 