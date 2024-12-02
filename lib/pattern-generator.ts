interface PatternTemplate {
  pattern: string;
  description: string;
  example: string;
}

export class PatternGenerator {
  private readonly patterns = {
    'L': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'l': 'abcdefghijklmnopqrstuvwxyz', 
    'd': '0123456789',
    's': '!@#$%^&*()_+-=[]{}|;:,.<>?',
    'w': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  };

  generateFromPattern(pattern: string): string {
    return pattern.split('').map(char => {
      if (char in this.patterns) {
        const chars = this.patterns[char as keyof typeof this.patterns];
        return chars[Math.floor(Math.random() * chars.length)];
      }
      return char;
    }).join('');
  }

  validatePattern(pattern: string): boolean {
    return pattern.split('').every(char => 
      char in this.patterns || !Object.values(this.patterns).some(set => set.includes(char))
    );
  }

  getPatternStrength(pattern: string): number {
    let entropy = 0;
    pattern.split('').forEach(char => {
      if (char in this.patterns) {
        entropy += Math.log2(this.patterns[char as keyof typeof this.patterns].length);
      }
    });
    return entropy;
  }
} 