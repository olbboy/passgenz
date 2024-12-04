import { webcrypto } from 'crypto';
import { PasswordOptions, GenerationResult, PasswordAnalysis } from './types';

// Shared utilities
const charsets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Helper function to convert bytes to string
function bytesToString(bytes: Uint8Array, chars: string): string {
  return Array.from(bytes)
    .map((byte: number) => chars[byte % chars.length])
    .join('');
}

// Helper function to analyze password strength
function analyzePassword(password: string): PasswordAnalysis {
  const length = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  
  const charsetSize = 
    (hasUpper ? 26 : 0) +
    (hasLower ? 26 : 0) +
    (hasNumber ? 10 : 0) +
    (hasSymbol ? 32 : 0);

  const entropy = Math.log2(Math.pow(charsetSize, length));
  
  // Build weaknesses array
  const weaknesses: string[] = [];
  if (length < 12) weaknesses.push('Length too short');
  if (!hasUpper) weaknesses.push('No uppercase letters');
  if (!hasLower) weaknesses.push('No lowercase letters');
  if (!hasNumber) weaknesses.push('No numbers');
  if (!hasSymbol) weaknesses.push('No special characters');

  // Check for patterns
  const hasCommonWords = /\b(password|admin|user|login)\b/i.test(password);
  const hasKeyboardPatterns = /qwerty|asdf|zxcv/i.test(password);
  const hasRepeatingChars = /(.)\1{2,}/.test(password);
  const hasSequentialChars = /(abc|123|xyz)/i.test(password);

  if (hasCommonWords) weaknesses.push('Contains common words');
  if (hasKeyboardPatterns) weaknesses.push('Contains keyboard patterns');
  if (hasRepeatingChars) weaknesses.push('Contains repeating characters');
  if (hasSequentialChars) weaknesses.push('Contains sequential characters');

  return {
    entropy,
    strength: entropy > 80 ? 'very-strong' 
      : entropy > 60 ? 'strong'
      : entropy > 40 ? 'medium'
      : 'weak',
    timeToCrack: entropy > 80 ? '> 1000 years'
      : entropy > 60 ? '> 100 years'
      : entropy > 40 ? '> 1 year'
      : '< 1 year',
    quantumResistant: entropy > 80,
    weaknesses,
    patterns: {  // Add structured patterns
      hasCommonWords,
      hasKeyboardPatterns,
      hasRepeatingChars,
      hasSequentialChars
    },
    characterDistribution: {
      uppercase: (password.match(/[A-Z]/g) || []).length,
      lowercase: (password.match(/[a-z]/g) || []).length,
      numbers: (password.match(/[0-9]/g) || []).length,
      symbols: (password.match(/[^A-Za-z0-9]/g) || []).length
    }
  };
}

class QuantumSafeGenerator {
  private static instance: QuantumSafeGenerator;
  private crypto: Crypto;

  private constructor() {
    // Fix type error by casting
    this.crypto = (typeof window !== 'undefined' ? window.crypto : webcrypto) as Crypto;
  }

  static getInstance(): QuantumSafeGenerator {
    if (!QuantumSafeGenerator.instance) {
      QuantumSafeGenerator.instance = new QuantumSafeGenerator();
    }
    return QuantumSafeGenerator.instance;
  }

  async getRandomBytes(length: number): Promise<Uint8Array> {
    const bytes = new Uint8Array(length);
    this.crypto.getRandomValues(bytes);
    return bytes;
  }
}

// Export all functions
export { generatePassword, generatePin, generateId, generateSecret };

// Implement functions
async function generatePassword(length: number, options: PasswordOptions): Promise<GenerationResult> {
  // Define character sets
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  // Create array of enabled character sets
  const enabledSets = [];
  if (options.uppercase) enabledSets.push(charSets.uppercase);
  if (options.lowercase) enabledSets.push(charSets.lowercase);
  if (options.numbers) enabledSets.push(charSets.numbers);
  if (options.symbols) enabledSets.push(charSets.symbols);

  if (!enabledSets.length) {
    throw new Error('Please select at least one character type');
  }

  // Ensure at least one character from each enabled set
  let password = '';
  enabledSets.forEach(set => {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % set.length;
    password += set[randomIndex];
  });

  // Fill remaining length with random characters from all enabled sets
  const allChars = enabledSets.join('');
  const remainingLength = length - password.length;
  const randomValues = crypto.getRandomValues(new Uint32Array(remainingLength));
  
  for (let i = 0; i < remainingLength; i++) {
    password += allChars[randomValues[i] % allChars.length];
  }

  // Shuffle the password
  const shuffled = password.split('');
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  password = shuffled.join('');

  return {
    password,
    analysis: analyzePassword(password)
  };
}

async function generatePin(
  length: number,
  type: 'numeric' | 'alphanumeric' | 'extended'
): Promise<{ pin: string; analysis: PasswordAnalysis }> {
  const generator = QuantumSafeGenerator.getInstance();
  let chars = '';
  
  switch (type) {
    case 'numeric':
      chars = charsets.numbers;
      break;
    case 'alphanumeric':
      chars = charsets.numbers + charsets.uppercase;
      break;
    case 'extended':
      chars = charsets.numbers + charsets.uppercase + charsets.symbols;
      break;
  }

  const randomBytes = await generator.getRandomBytes(length * 2);
  const pin = bytesToString(randomBytes, chars).slice(0, length);

  return {
    pin,
    analysis: analyzePassword(pin)
  };
}

async function generateId(
  format: 'uuid' | 'nanoid' | 'custom',
  prefix?: string
): Promise<{ id: string; analysis: PasswordAnalysis }> {
  const generator = QuantumSafeGenerator.getInstance();
  const crypto = typeof window !== 'undefined' ? window.crypto : webcrypto;
  let id = '';

  switch (format) {
    case 'uuid':
      id = crypto.randomUUID();
      break;
    case 'nanoid': {
      const randomBytes = await generator.getRandomBytes(21);
      const chars = charsets.numbers + charsets.lowercase + charsets.uppercase;
      id = bytesToString(randomBytes, chars);
      break;
    }
    case 'custom': {
      const randomBytes = await generator.getRandomBytes(12);
      const chars = charsets.numbers + charsets.uppercase;
      id = bytesToString(randomBytes, chars);
      break;
    }
  }

  const finalId = prefix ? `${prefix}-${id}` : id;
  return {
    id: finalId,
    analysis: analyzePassword(finalId)
  };
}

async function generateSecret(
  format: 'hex' | 'base64'
): Promise<{ secret: string; analysis: PasswordAnalysis }> {
  const generator = QuantumSafeGenerator.getInstance();
  const bytes = await generator.getRandomBytes(32);
  
  let secret = '';
  if (format === 'hex') {
    secret = Array.from(bytes)
      .map((byte: number) => byte.toString(16).padStart(2, '0'))
      .join('');
  } else {
    secret = Buffer.from(bytes).toString('base64');
  }

  return {
    secret,
    analysis: analyzePassword(secret)
  };
} 