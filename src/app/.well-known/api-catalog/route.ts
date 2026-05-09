import { NextResponse } from 'next/server'

// RFC 9727 API Catalog — application/linkset+json format (RFC 9264)
const linkset = {
  linkset: [
    {
      anchor: 'https://www.food-mood.app/api',
      'service-desc': [
        {
          href: 'https://www.food-mood.app/api/openapi',
          type: 'application/openapi+json',
        },
      ],
      'service-doc': [
        {
          href: 'https://www.food-mood.app/sobre-nosotros',
          type: 'text/html',
        },
      ],
      status: [
        {
          href: 'https://www.food-mood.app/api/health',
        },
      ],
    },
  ],
}

export function GET() {
  return new NextResponse(JSON.stringify(linkset), {
    headers: {
      'Content-Type':  'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
