import { charsets, generateRandomString } from './utils'
import { webcrypto } from 'crypto'

// Get secure crypto implementation
const getCrypto = () => {
  if (typeof window !== 'undefined') {
    return window.crypto
  }
  return webcrypto
}

// Generate quantum-safe random bytes
async function getSecureRandomBytes(length: number): Promise<Uint8Array> {
  const array = new Uint8Array(length)
  const crypto = getCrypto()
  if ('getRandomValues' in crypto) {
    crypto.getRandomValues(array)
  }
  return array
}

// Memorable password generation using wordlists
async function generateMemorablePassword(length: number): Promise<string> {
  // Implement wordlist-based generation
  const words = [
    'correct', 'horse', 'battery', 'staple',
    'apple', 'banana', 'orange', 'grape',
    'red', 'blue', 'green', 'yellow',
    'quick', 'slow', 'happy', 'sad'
  ]
  
  let result = ''
  while (result.length < length) {
    const randomBytes = await getSecureRandomBytes(2)
    const wordIndex = randomBytes[0] % words.length
    result += words[wordIndex]
  }
  
  return result.slice(0, length)
}

export async function generatePassword(
  length: number,
  options: { 
    uppercase: boolean
    lowercase: boolean
    numbers: boolean
    symbols: boolean
    memorable?: boolean
  }
): Promise<string> {
  let validChars = ''
  if (options.uppercase) validChars += charsets.uppercase
  if (options.lowercase) validChars += charsets.lowercase
  if (options.numbers) validChars += charsets.numbers
  if (options.symbols) validChars += charsets.symbols

  if (!validChars) {
    throw new Error('Please select at least one character type')
  }

  if (options.memorable) {
    return generateMemorablePassword(length)
  }

  // Use secure random bytes for generation
  const randomBytes = await getSecureRandomBytes(length * 2)
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += validChars.charAt(randomBytes[i] % validChars.length)
  }

  return result
}

export async function generatePin(
  length: number, 
  type: 'numeric' | 'alphanumeric' | 'extended'
): Promise<string> {
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
  
  const randomBytes = await getSecureRandomBytes(length * 2)
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomBytes[i] % chars.length)
  }
  
  return result
}

export async function generateId(
  format: 'uuid' | 'nanoid' | 'custom', 
  prefix?: string
): Promise<string> {
  let result = ''
  const crypto = getCrypto()
  
  switch (format) {
    case 'uuid':
      result = crypto.randomUUID()
      break
    case 'nanoid': {
      const randomBytes = await getSecureRandomBytes(21)
      const chars = charsets.numbers + charsets.lowercase + charsets.uppercase
      result = Array.from(randomBytes)
        .map(byte => chars[byte % chars.length])
        .join('')
      break
    }
    case 'custom': {
      const randomBytes = await getSecureRandomBytes(12)
      const chars = charsets.numbers + charsets.uppercase
      result = Array.from(randomBytes)
        .map(byte => chars[byte % chars.length])
        .join('')
      break
    }
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