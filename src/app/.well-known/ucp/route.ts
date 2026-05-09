import { NextResponse } from 'next/server'

// Universal Commerce Protocol discovery document (https://ucp.dev)
// Signing key matches /.well-known/http-message-signatures-directory (Web Bot Auth)
const UCP = {
  ucp: {
    version: '2026-04-08',
    services: {
      'dev.ucp.shopping': [
        {
          version:   '2026-04-08',
          spec:      'https://ucp.dev/2026-04-08/specification/overview',
          transport: 'rest',
          endpoint:  'https://www.food-mood.app/api',
          schema:    'https://ucp.dev/2026-04-08/services/shopping/rest.openapi.json',
        },
      ],
    },
    capabilities: {
      'dev.ucp.shopping.checkout': [
        {
          version: '2026-04-08',
          spec:    'https://ucp.dev/2026-04-08/specification/checkout',
          schema:  'https://ucp.dev/2026-04-08/schemas/shopping/checkout.json',
          config: {
            currency: 'EUR',
            products: [
              { id: 'premium-monthly',   name: 'Food·Mood Premium mensual',    amount: 9,  currency: 'EUR', interval: 'month'   },
              { id: 'premium-quarterly', name: 'Food·Mood Premium trimestral', amount: 21, currency: 'EUR', interval: 'quarter' },
            ],
          },
          available_instruments: ['card', 'stripe'],
        },
      ],
    },
  },
  signing_keys: [
    {
      kty: 'OKP',
      crv: 'Ed25519',
      kid: 'food-mood-bot-2026',
      x:   'WpY4JfNGWhMB2aaIZYOYS4ADm7fZt0XxnaJtwi_vcA4',
    },
  ],
}

export function GET() {
  return NextResponse.json(UCP, {
    headers: { 'Cache-Control': 'public, max-age=86400' },
  })
}
