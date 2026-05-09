import { x402ResourceServer } from '@x402/next'
import { HTTPFacilitatorClient } from '@x402/core/server'
import { ExactEvmScheme } from '@x402/evm/exact/server'

// eip155:84532 = Base Sepolia (testnet). Switch to eip155:8453 for Base mainnet.
export const X402_NETWORK = (process.env.X402_NETWORK ?? 'eip155:84532') as `${string}:${string}`
export const X402_PAYTO   = process.env.X402_EVM_ADDRESS ?? '0x0000000000000000000000000000000000000000'

const facilitator = new HTTPFacilitatorClient({
  url: process.env.X402_FACILITATOR_URL ?? 'https://x402.org/facilitator',
})

export const x402Server = new x402ResourceServer(facilitator)
  .register(X402_NETWORK, new ExactEvmScheme())
