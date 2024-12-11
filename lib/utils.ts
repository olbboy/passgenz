import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PasswordRequirements } from "./types"

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
    uppercase: '[A-Z]',
    lowercase: '[a-z]',
    number: '[0-9]',
    symbol: '[!@#$%^&*()_+\\-=\\[\\]{};:,.<>?]'
  } as const;

  let pattern = '';
  const requiredTypes = requirements.passwordRules.characterRequirements.allowedCharacterSets
    .filter(set => set.required)
    .map(set => set.type as keyof typeof patternMap);

  requiredTypes.forEach(type => {
    if (patternMap[type]) {
      pattern += patternMap[type];
    }
  });

  const { min, max } = requirements.passwordRules.length;
  pattern = `.{${min},${max || ''}}`;

  const excludedChars = requirements.passwordRules.customConstraints
    .filter(constraint => constraint.type === 'excluded-chars')
    .flatMap(constraint => constraint.parameters?.chars || []);

  if (excludedChars.length > 0) {
    pattern = `(?!.*[${excludedChars.join('')}])${pattern}`;
  }

  if (!requirements.passwordRules.patterns.allowCommonWords) {
    pattern = `(?!.*(?:password|admin|user))${pattern}`;
  }
  if (!requirements.passwordRules.patterns.allowKeyboardPatterns) {
    pattern = `(?!.*(?:qwerty|asdf|zxcv))${pattern}`;
  }
  if (!requirements.passwordRules.patterns.allowRepeatingChars) {
    pattern = `(?!.*(.)\\1{2,})${pattern}`;
  }
  if (!requirements.passwordRules.patterns.allowSequentialChars) {
    pattern = `(?!.*(?:123|abc))${pattern}`;
  }

  return pattern;
}

export function calculateTimeToCrack(entropy: number): string {
  const secondsPerGuess = 0.001; // Assume 1000 guesses per second
  const combinations = Math.pow(2, entropy);
  const seconds = combinations * secondsPerGuess;

  if (seconds > 31536000 * 100) return '> 100 years';
  if (seconds > 31536000) return '> 1 year';
  if (seconds > 86400 * 30) return '> 1 month';
  if (seconds > 86400) return '> 1 day';
  if (seconds > 3600) return '> 1 hour';
  if (seconds > 60) return '> 1 minute';
  return '< 1 minute';
}

export function validatePasswordAgainstPattern(password: string, pattern: string): boolean {
  try {
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(password);
  } catch (error) {
    console.error('Invalid pattern:', error);
    return false;
  }
}
