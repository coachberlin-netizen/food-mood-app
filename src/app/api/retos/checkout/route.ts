import { NextResponse } from 'next/server'

// La compra directa de retos por el consumidor está desactivada.
// Los programas se asignan por el profesional vía /api/pro/protocols/activate.
export async function POST() {
  return NextResponse.json(
    { error: 'La compra directa de programas no está disponible. Tu profesional de salud te dará acceso.' },
    { status: 410 }
  )
}
