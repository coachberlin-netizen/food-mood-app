import { NextResponse } from 'next/server'

// Ed25519 public key for Web Bot Auth (RFC — IETF WebBotAuth WG)
// Private key stored in WEBBOTAUTH_PRIVATE_KEY env var (d parameter, base64url)
const JWKS = {
  keys: [
    {
      kty: 'OKP',
      crv: 'Ed25519',
      kid: 'food-mood-bot-2026',
      x: 'WpY4JfNGWhMB2aaIZYOYS4ADm7fZt0XxnaJtwi_vcA4',
    },
  ],
}

export function GET() {
  return NextResponse.json(JWKS, {
    headers: {
      'Content-Type': 'application/http-message-signatures-directory+json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
