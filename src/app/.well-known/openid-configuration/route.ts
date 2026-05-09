import { NextResponse } from 'next/server'

// Supabase is the OIDC authorization server for Food·Mood.
// This document lets agents discover auth endpoints without prior knowledge of the Supabase project URL.
export function GET() {
  const issuer = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`

  const metadata = {
    issuer,
    authorization_endpoint:              `${issuer}/authorize`,
    token_endpoint:                      `${issuer}/token`,
    jwks_uri:                            `${issuer}/.well-known/jwks.json`,
    userinfo_endpoint:                   `${issuer}/user`,
    revocation_endpoint:                 `${issuer}/logout`,
    response_types_supported:            ['code', 'token', 'id_token'],
    grant_types_supported:               ['authorization_code', 'implicit', 'refresh_token', 'client_credentials'],
    subject_types_supported:             ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported:                    ['openid', 'profile', 'email', 'offline_access'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
    claims_supported:                    ['sub', 'iss', 'aud', 'exp', 'iat', 'email', 'email_verified', 'name', 'role'],
    code_challenge_methods_supported:    ['S256'],
  }

  return NextResponse.json(metadata, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  })
}
