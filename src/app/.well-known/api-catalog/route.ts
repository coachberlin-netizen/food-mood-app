import { NextResponse } from 'next/server'

const catalog = {
  apis: [
    {
      id: 'https://www.food-mood.app/api',
      title: 'Food·Mood API',
      description:
        'API for the Food·Mood wellness platform — gut-brain science, emotional recipe recommendations, and user tracking.',
      humanURL: 'https://www.food-mood.app',
      baseURL: 'https://www.food-mood.app/api',
      tags: ['food', 'wellness', 'recipes', 'gut-brain', 'nutrition'],
      properties: [
        {
          type: 'X-service-doc',
          url: 'https://www.food-mood.app/sobre-nosotros',
        },
      ],
    },
  ],
}

export function GET() {
  return NextResponse.json(catalog, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
