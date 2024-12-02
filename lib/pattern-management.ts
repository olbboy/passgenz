export interface PasswordPattern {
  id: string;
  name: string;
  pattern: string;
  description: string;
  example: string;
  strength: number;
  tags: string[];
  metadata: {
    creator: string;
    created: Date;
    modified: Date;
    usageCount: number;
  };
}

export class PatternManagementService {
  private static instance: PatternManagementService;
  private patterns: Map<string, PasswordPattern> = new Map();

  static getInstance(): PatternManagementService {
    if (!PatternManagementService.instance) {
      PatternManagementService.instance = new PatternManagementService();
    }
    return PatternManagementService.instance;
  }

  addPattern(pattern: Omit<PasswordPattern, 'id' | 'metadata'>): PasswordPattern {
    const id = crypto.randomUUID();
    const newPattern: PasswordPattern = {
      ...pattern,
      id,
      metadata: {
        creator: 'system',
        created: new Date(),
        modified: new Date(),
        usageCount: 0
      }
    };

    this.patterns.set(id, newPattern);
    return newPattern;
  }

  getPattern(id: string): PasswordPattern | undefined {
    return this.patterns.get(id);
  }

  searchPatterns(query: {
    tags?: string[];
    minStrength?: number;
    creator?: string;
  }): PasswordPattern[] {
    return Array.from(this.patterns.values()).filter(pattern => {
      if (query.tags && !query.tags.every(tag => pattern.tags.includes(tag))) {
        return false;
      }
      if (query.minStrength && pattern.strength < query.minStrength) {
        return false;
      }
      if (query.creator && pattern.metadata.creator !== query.creator) {
        return false;
      }
      return true;
    });
  }

  validatePattern(pattern: string): boolean {
    try {
      // Test pattern validity
      new RegExp(pattern);
      return true;
    } catch {
      return false;
    }
  }

  generateFromPattern(pattern: string): string {
    // Implement pattern-based generation
    return 'generated-password';
  }
} 