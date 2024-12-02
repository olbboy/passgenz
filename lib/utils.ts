import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PasswordRequirements } from '@/lib/context-analyzer'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRandomString(length: number, charset: string): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}

export const charsets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
}

export function generatePatternFromRequirements(requirements: PasswordRequirements): string {
  const patternMap = {
    uppercase: 'L',
    lowercase: 'l',
    number: 'd',
    symbol: 's'
  } as const;

  let pattern = '';
  requirements.requiredChars.forEach((char: 'uppercase' | 'lowercase' | 'number' | 'symbol') => {
    pattern += patternMap[char];
  });

  // Pad to minimum length if needed
  while (pattern.length < requirements.minLength) {
    pattern += 'l'; // Pad with lowercase
  }

  return pattern;
}

export function calculateTimeToCrack(entropy: number): string {
  const secondsToHuman = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    return `${Math.round(seconds / 31536000)} years`;
  };

  // 2^entropy is the number of guesses needed
  // Assume 1 billion guesses per second for modern hardware
  const seconds = Math.pow(2, entropy) / 1_000_000_000;
  return secondsToHuman(seconds);
}
