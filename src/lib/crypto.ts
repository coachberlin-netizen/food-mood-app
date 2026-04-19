/**
 * Server-side only — uses Node.js crypto module.
 * Do NOT import in client components.
 *
 * AES-256-GCM with per-user key derived via PBKDF2.
 * Stored format: base64(iv):base64(authTag):base64(ciphertext)
 */

import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from "crypto"

const ALGORITHM  = "aes-256-gcm"
const IV_BYTES   = 12  // 96-bit IV recommended for GCM
const TAG_BYTES  = 16
const KEY_BYTES  = 32  // 256-bit key for AES-256
const PBKDF2_ITER = 100_000
const SEPARATOR  = ":"

function deriveKey(userId: string): Buffer {
  const secret = process.env.ENCRYPTION_SECRET
  if (!secret) throw new Error("ENCRYPTION_SECRET is not defined")
  // userId is the "password", server secret is the salt (or vice versa)
  // Both are required to derive the key → neither alone is sufficient
  return pbkdf2Sync(secret, userId, PBKDF2_ITER, KEY_BYTES, "sha256")
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a string safe to store in a database TEXT column.
 */
export function encryptSensitive(value: string, userId: string): string {
  const key = deriveKey(userId)
  const iv  = randomBytes(IV_BYTES)

  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(SEPARATOR)
}

/**
 * Decrypts a value previously encrypted with encryptSensitive.
 * Throws if the ciphertext has been tampered with (GCM auth tag check).
 */
export function decryptSensitive(value: string, userId: string): string {
  const parts = value.split(SEPARATOR)
  if (parts.length !== 3) throw new Error("Invalid ciphertext format")

  const [ivB64, tagB64, ciphertextB64] = parts
  const key        = deriveKey(userId)
  const iv         = Buffer.from(ivB64, "base64")
  const authTag    = Buffer.from(tagB64, "base64")
  const ciphertext = Buffer.from(ciphertextB64, "base64")

  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8")
}
