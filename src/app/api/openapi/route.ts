import { NextResponse } from 'next/server'

const spec = {
  openapi: '3.1.0',
  info: {
    title:       'Food·Mood API',
    version:     '1.0.0',
    description: 'API for the Food·Mood wellness platform — gut-brain science, emotional recipe recommendations, and user tracking.',
    contact: {
      name:  'Food·Mood',
      url:   'https://www.food-mood.app',
      email: 'info@food-mood.app',
    },
    license: {
      name: 'Proprietary',
    },
  },
  servers: [
    { url: 'https://www.food-mood.app/api', description: 'Production' },
  ],
  paths: {
    '/health': {
      get: {
        summary:     'Health check',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type:       'object',
                  properties: {
                    status:    { type: 'string', example: 'ok' },
                    service:   { type: 'string', example: 'food-mood' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/recetas': {
      get: {
        summary:     'List recipes',
        operationId: 'listRecetas',
        description: 'Returns functional recipes filtered by mood, age range, gender and premium level.',
        parameters: [
          { name: 'mood',          in: 'query', schema: { type: 'string' }, description: 'Dominant emotional mood (e.g. calma, activacion, focus)' },
          { name: 'premium_level', in: 'query', schema: { type: 'integer' }, description: 'Minimum premium level (0 = free)' },
        ],
        responses: {
          '200': { description: 'Array of recipe objects' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/leads': {
      post: {
        summary:     'Newsletter subscription',
        operationId: 'subscribeLead',
        description: 'Subscribe an email address to the Food·Mood weekly newsletter.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type:       'object',
                required:   ['email'],
                properties: {
                  email:  { type: 'string', format: 'email' },
                  source: { type: 'string', description: 'Signup source identifier' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Subscribed successfully' },
          '400': { description: 'Invalid email' },
          '409': { description: 'Already subscribed' },
        },
      },
    },
  },
}

export function GET() {
  return new NextResponse(JSON.stringify(spec, null, 2), {
    headers: {
      'Content-Type':  'application/openapi+json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
