import { NextResponse } from 'next/server'

// RFC 9728 — OAuth 2.0 Protected Resource Metadata
// Tells agents which authorization server can issue tokens for this resource.
export function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://supabase.co'

  const metadata = {
    resource:                  'https://www.food-mood.app',
    resource_name:             'Food·Mood',
    authorization_servers:     [`${supabaseUrl}/auth/v1`],
    bearer_methods_supported:  ['header'],
    scopes_supported:          ['openid', 'profile', 'email'],
    resource_documentation:    'https://www.food-mood.app/api/openapi',
    resource_policy_uri:       'https://www.food-mood.app/privacidad',
    resource_tos_uri:          'https://www.food-mood.app/terminos',
  }

  return NextResponse.json(metadata, {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  })
}
