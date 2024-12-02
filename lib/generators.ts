import { charsets, generateRandomString } from './utils'

export function generatePassword(
  length: number,
  options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }
): string {
  let validChars = ''
  if (options.uppercase) validChars += charsets.uppercase
  if (options.lowercase) validChars += charsets.lowercase
  if (options.numbers) validChars += charsets.numbers
  if (options.symbols) validChars += charsets.symbols

  if (!validChars) {
    throw new Error('Please select at least one character type')
  }

  return generateRandomString(length, validChars)
}

export function generatePin(length: number, type: 'numeric' | 'alphanumeric' | 'extended'): string {
  let chars = ''
  switch (type) {
    case 'numeric':
      chars = charsets.numbers
      break
    case 'alphanumeric':
      chars = charsets.numbers + charsets.uppercase
      break
    case 'extended':
      chars = charsets.numbers + charsets.uppercase + charsets.symbols
      break
  }
  return generateRandomString(length, chars)
}

export function generateId(format: 'uuid' | 'nanoid' | 'custom', prefix?: string): string {
  let result = ''
  
  const getCrypto = () => {
    if (typeof window !== 'undefined') {
      return window.crypto
    }
    return require('crypto').webcrypto
  }
  
  switch (format) {
    case 'uuid':
      result = getCrypto().randomUUID()
      break
    case 'nanoid':
      result = generateRandomString(21, charsets.numbers + charsets.lowercase + charsets.uppercase)
      break
    case 'custom':
      result = generateRandomString(12, charsets.numbers + charsets.uppercase)
      break
  }

  return prefix ? `${prefix}-${result}` : result
}

export async function generateSecret(format: 'hex' | 'base64'): Promise<string> {
  const array = new Uint8Array(32)
  const crypto = typeof window !== 'undefined' ? window.crypto : require('crypto').webcrypto
  crypto.getRandomValues(array)
  
  if (format === 'hex') {
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  } else {
    return Buffer.from(array).toString('base64')
  }
} 