export interface CollisionConfig {
  namespace: string;
  format: 'uuid' | 'nanoid' | 'custom';
  prefix?: string;
  length?: number;
}

export class CollisionDetectionService {
  private static instance: CollisionDetectionService;
  private readonly usedIds: Map<string, Set<string>> = new Map();
  private readonly reservedIds: Map<string, Set<string>> = new Map();

  static getInstance(): CollisionDetectionService {
    if (!CollisionDetectionService.instance) {
      CollisionDetectionService.instance = new CollisionDetectionService();
    }
    return CollisionDetectionService.instance;
  }

  async checkCollision(id: string, namespace: string): Promise<boolean> {
    const namespaceIds = this.usedIds.get(namespace) || new Set();
    const reservedIds = this.reservedIds.get(namespace) || new Set();

    return namespaceIds.has(id) || reservedIds.has(id);
  }

  async reserveId(id: string, namespace: string, ttl: number = 300000): Promise<boolean> {
    const reservedIds = this.reservedIds.get(namespace) || new Set();
    
    if (await this.checkCollision(id, namespace)) {
      return false;
    }

    reservedIds.add(id);
    this.reservedIds.set(namespace, reservedIds);

    // Auto-release after TTL
    setTimeout(() => {
      reservedIds.delete(id);
    }, ttl);

    return true;
  }

  async registerUsedId(id: string, namespace: string): Promise<boolean> {
    const namespaceIds = this.usedIds.get(namespace) || new Set();
    
    if (await this.checkCollision(id, namespace)) {
      return false;
    }

    // Remove from reserved if exists
    const reservedIds = this.reservedIds.get(namespace);
    reservedIds?.delete(id);

    namespaceIds.add(id);
    this.usedIds.set(namespace, namespaceIds);
    return true;
  }

  async generateUniqueId(config: CollisionConfig): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const id = await this.generateId(config);
      if (!await this.checkCollision(id, config.namespace)) {
        await this.registerUsedId(id, config.namespace);
        return id;
      }
      attempts++;
    }

    throw new Error('Failed to generate unique ID after maximum attempts');
  }

  private async generateId(config: CollisionConfig): Promise<string> {
    switch (config.format) {
      case 'uuid':
        return crypto.randomUUID();
      case 'nanoid':
        return this.generateNanoId(config.length || 21);
      case 'custom':
        return this.generateCustomId(config);
      default:
        throw new Error(`Unsupported ID format: ${config.format}`);
    }
  }

  private generateNanoId(length: number): string {
    const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(x => charset[x % charset.length])
      .join('');
  }

  private generateCustomId(config: CollisionConfig): string {
    const prefix = config.prefix ? `${config.prefix}-` : '';
    const randomPart = this.generateNanoId(config.length || 12);
    return `${prefix}${randomPart}`;
  }
} 