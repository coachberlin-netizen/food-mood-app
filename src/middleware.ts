import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ALLOWED_ORIGINS = [
  'https://www.food-mood.app',
  'https://food-mood.app',
  'http://localhost:3000',
]

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin':      allowed,
    'Access-Control-Allow-Methods':     'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':     'Content-Type, Authorization, x-telegram-bot-api-secret-token',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age':           '86400',
  }
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')

  // Handle CORS preflight for API routes
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api/')) {
    return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // protected routes
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname.startsWith('/perfil');
  const isAdminRoute = pathname.startsWith('/admin');
  const isRecetasRoute = pathname.startsWith('/recetas');

  // Redirect unauthenticated users from protected routes (not /recetas — that's public)
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Basic password protection for admin can be handled within the page itself
  // so we don't necessarily block it here unless we implement full admin auth.

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const cors = corsHeaders(origin)
    Object.entries(cors).forEach(([k, v]) => supabaseResponse.headers.set(k, v))
  }

  const csp = [
    "default-src 'self'",
    // Next.js necesita unsafe-inline; Stripe y Vercel Analytics necesitan sus dominios
    "script-src 'self' 'unsafe-inline' https://js.stripe.com https://va.vercel-scripts.com",
    // Estilos: inline (Tailwind/Framer) + Google Fonts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Fuentes
    "font-src 'self' https://fonts.gstatic.com",
    // Imágenes: Supabase storage (wildcard cubre ambos proyectos)
    "img-src 'self' data: blob: https://*.supabase.co",
    // Conexiones: Supabase, AI APIs, Stripe, Vercel Analytics, Resend (server-side, no CSP needed)
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://generativelanguage.googleapis.com https://api.stripe.com https://vitals.vercel-insights.com",
    // Iframes: solo Stripe (checkout embebido)
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    // Audio/video: Supabase storage para audios de retos
    "media-src 'self' blob: https://*.supabase.co",
    // Service Worker (PWA)
    "worker-src 'self' blob:",
    // Manifest PWA
    "manifest-src 'self'",
    // Formularios solo al propio dominio
    "form-action 'self'",
    // Base URL
    "base-uri 'self'",
    // No iframes externos
    "frame-ancestors 'none'",
    // Forzar HTTPS
    "upgrade-insecure-requests",
  ].join('; ')

  supabaseResponse.headers.set('Content-Security-Policy',       csp)
  supabaseResponse.headers.set('Strict-Transport-Security',     'max-age=63072000; includeSubDomains; preload')
  supabaseResponse.headers.set('X-Frame-Options',               'DENY')
  supabaseResponse.headers.set('X-Content-Type-Options',        'nosniff')
  supabaseResponse.headers.set('X-DNS-Prefetch-Control',        'on')
  supabaseResponse.headers.set('Referrer-Policy',               'strict-origin-when-cross-origin')
  supabaseResponse.headers.set('Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()'
  )

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
