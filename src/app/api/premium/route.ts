import { NextRequest, NextResponse } from 'next/server'
import { withX402 } from '@x402/next'
import { x402Server, X402_PAYTO, X402_NETWORK } from '@/lib/x402/server'

const handler = async (_req: NextRequest): Promise<NextResponse> => {
  return NextResponse.json({
    message: 'Food·Mood premium content — personalised functional recipe recommendations.',
    info: 'Access the full experience at https://www.food-mood.app/pricing',
  })
}

export const GET = withX402(
  handler,
  {
    accepts: [
      {
        scheme: 'exact',
        price: '$0.001',
        network: X402_NETWORK,
        payTo:   X402_PAYTO,
      },
    ],
    description: 'Food·Mood premium recipe recommendations',
  },
  x402Server,
  undefined, // paywallConfig
  undefined, // paywall
  false,     // syncFacilitatorOnStart — skip facilitator handshake on cold start
)
