import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey(): Buffer {
  const hex = process.env.BIOMARKER_TOKEN_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("BIOMARKER_TOKEN_KEY debe ser un hex de 64 caracteres (32 bytes)");
  }
  return Buffer.from(hex, "hex");
}

/** Cifra un token OAuth. Devuelve base64(iv[12] + authTag[16] + ciphertext). */
export function encryptToken(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

/** Descifra un token previamente cifrado con encryptToken. */
export function decryptToken(encoded: string): string {
  const key = getKey();
  const buf = Buffer.from(encoded, "base64");
  if (buf.length < IV_LEN + TAG_LEN) throw new Error("Token cifrado inválido");
  const iv = buf.subarray(0, IV_LEN);
  const authTag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ciphertext = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(ciphertext, undefined, "utf8") + decipher.final("utf8");
}
