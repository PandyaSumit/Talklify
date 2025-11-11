import crypto from 'crypto'

// AES-256 encryption for meeting links
const ALGORITHM = 'aes-256-cbc'
const IV_LENGTH = 16

// Default encryption key for development (DO NOT use in production)
const DEFAULT_DEV_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'

/**
 * Gets the encryption key from environment or uses default for development
 */
function getEncryptionKey(): Buffer {
  let keyString = process.env.ENCRYPTION_KEY

  // If env var doesn't exist or is too short, use default dev key
  if (!keyString || keyString.trim().length < 64) {
    console.warn('ENCRYPTION_KEY not set or too short, using default development key')
    keyString = DEFAULT_DEV_KEY
  }

  try {
    // Convert hex string to buffer (32 bytes for AES-256)
    const key = Buffer.from(keyString.slice(0, 64), 'hex')

    // Verify the key is exactly 32 bytes
    if (key.length !== 32) {
      throw new Error('Invalid key length')
    }

    return key
  } catch (error) {
    console.error('Encryption key error:', error)
    // If the env key is invalid, fall back to default
    console.warn('ENCRYPTION_KEY is not a valid hex string, using default development key')
    return Buffer.from(DEFAULT_DEV_KEY, 'hex')
  }
}

/**
 * Encrypts a meeting link using AES-256-CBC
 * @param text - The meeting link to encrypt
 * @returns Encrypted text in format: iv:encryptedData
 */
export function encryptMeetingLink(text: string): string {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Meeting link must be a non-empty string')
    }

    const key = getEncryptionKey()
    const iv = crypto.randomBytes(IV_LENGTH)

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return `${iv.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error(`Failed to encrypt meeting link: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decrypts a meeting link encrypted with AES-256-CBC
 * @param text - The encrypted text in format: iv:encryptedData
 * @returns Decrypted meeting link
 */
export function decryptMeetingLink(text: string): string {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Encrypted text must be a non-empty string')
    }

    const parts = text.split(':')
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted format. Expected format: iv:encryptedData')
    }

    const key = getEncryptionKey()
    const iv = Buffer.from(parts[0], 'hex')
    const encryptedText = parts[1]

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error(`Failed to decrypt meeting link: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validates if a string is a valid URL
 * @param urlString - The URL to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Generate a new encryption key (for setup purposes)
 * Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString('hex')
}
