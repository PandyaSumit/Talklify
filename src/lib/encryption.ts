import crypto from 'crypto'

// AES-256 encryption for meeting links
const ALGORITHM = 'aes-256-cbc'
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
const IV_LENGTH = 16

/**
 * Encrypts a meeting link using AES-256-CBC
 * @param text - The meeting link to encrypt
 * @returns Encrypted text in format: iv:encryptedData
 */
export function encryptMeetingLink(text: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH)
    const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex')

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return `${iv.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt meeting link')
  }
}

/**
 * Decrypts a meeting link encrypted with AES-256-CBC
 * @param text - The encrypted text in format: iv:encryptedData
 * @returns Decrypted meeting link
 */
export function decryptMeetingLink(text: string): string {
  try {
    const parts = text.split(':')
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted format')
    }

    const iv = Buffer.from(parts[0], 'hex')
    const encryptedText = parts[1]
    const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex')

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt meeting link')
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
