import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'API key missing' }, { status: 500 })

  const formData = await req.formData()
  const audio = formData.get('audio') as File | null
  if (!audio) return NextResponse.json({ error: 'No audio' }, { status: 400 })

  // Reject files over 20 MB (Gemini inline limit)
  if (audio.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: 'Audio too large' }, { status: 413 })
  }

  const buffer   = await audio.arrayBuffer()
  const base64   = Buffer.from(buffer).toString('base64')
  const mimeType = audio.type || 'audio/webm'

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent([
    {
      inlineData: { mimeType, data: base64 },
    },
    'Transcribe exactamente lo que se dice en este audio en español. Devuelve solo la transcripción, sin comentarios ni explicaciones.',
  ])

  const text = result.response.text().trim()
  if (!text) return NextResponse.json({ error: 'No transcription returned' }, { status: 500 })

  return NextResponse.json({ text })
}
