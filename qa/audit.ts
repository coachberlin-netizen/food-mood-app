import { chromium, Browser, BrowserContext, Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

export interface FlowResult {
  flow: string
  status: 'pass' | 'fail' | 'warn'
  durationMs: number
  notes: string
  metrics?: Record<string, number | string>
}

export interface AuditReport {
  date: string
  week: number
  baseUrl: string
  flows: FlowResult[]
  summary: {
    total: number
    passed: number
    failed: number
    warned: number
  }
}

const BASE_URL      = process.env.BASE_URL ?? 'https://food-mood.app'
const RESULTS_DIR   = path.join(__dirname, 'results')
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots')

const IPHONE14_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) ' +
  'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'

function getWeekNumber(date: Date): number {
  const jan4 = new Date(date.getFullYear(), 0, 4)
  return Math.ceil(((date.getTime() - jan4.getTime()) / 86_400_000 + jan4.getDay() + 1) / 7)
}

function ensureDirs(): void {
  fs.mkdirSync(RESULTS_DIR, { recursive: true })
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

async function shot(page: Page, name: string): Promise<void> {
  try {
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${name}.png`), fullPage: false })
  } catch { /* ignore */ }
}

// ── 1. Homepage ───────────────────────────────────────────────────────────────
async function testHomepage(page: Page): Promise<FlowResult> {
  const flow  = 'homepage'
  const start = Date.now()
  try {
    const response = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 })
    const loadTime  = Date.now() - start

    if (!response || !response.ok()) {
      await shot(page, `${flow}-error`)
      return { flow, status: 'fail', durationMs: loadTime, notes: `HTTP ${response?.status() ?? 'sin respuesta'}` }
    }

    await page.waitForTimeout(1000)
    const bodyText = await page.evaluate(() => document.body.innerText)

    const expected = ['Recetas que te cambian el humor', 'Come algo increíble', 'Recetas con superpoderes']
    const hasExpected = expected.some(t => bodyText.includes(t))

    const banned = ['KombuV', 'Bebe con belleza', 'Hotel']
    const foundBanned = banned.find(t => bodyText.includes(t))

    const cta = await page.$([
      'a[href*="quiz"]',
      'button:has-text("Empezar")',
      'button:has-text("Comenzar")',
      'a:has-text("Empieza")',
      'a:has-text("Descubre")',
    ].join(', '))

    await shot(page, flow)

    const notes: string[] = []
    let status: 'pass' | 'fail' | 'warn' = 'pass'

    if (!hasExpected)  { notes.push('Texto de hero no encontrado'); status = 'fail' }
    if (foundBanned)   { notes.push(`Texto prohibido: "${foundBanned}"`); status = 'fail' }
    if (!cta)          { notes.push('CTA principal no visible'); if (status === 'pass') status = 'warn' }
    if (loadTime > 5000) { notes.push(`Carga lenta: ${loadTime}ms`); if (status === 'pass') status = 'warn' }

    if (notes.length === 0) notes.push('OK')

    return {
      flow, status, durationMs: loadTime,
      notes: notes.join('; '),
      metrics: { loadTime, hasCta: cta ? 1 : 0 },
    }
  } catch (err: unknown) {
    await shot(page, `${flow}-crash`)
    return { flow, status: 'fail', durationMs: Date.now() - start, notes: String(err) }
  }
}

// ── 2. Mobile Viewport ────────────────────────────────────────────────────────
async function testMobileViewport(page: Page): Promise<FlowResult> {
  const flow  = 'mobile-viewport'
  const start = Date.now()
  try {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 })
    await page.waitForTimeout(500)

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    )

    await shot(page, flow)
    await page.setViewportSize({ width: 1280, height: 800 })

    return {
      flow,
      status: overflow ? 'fail' : 'pass',
      durationMs: Date.now() - start,
      notes: overflow
        ? 'Overflow horizontal detectado en 390px'
        : 'Sin overflow horizontal en 390×844',
      metrics: { viewport: '390x844', overflow: overflow ? 1 : 0 },
    }
  } catch (err: unknown) {
    await page.setViewportSize({ width: 1280, height: 800 }).catch(() => { /* ignore */ })
    await shot(page, `${flow}-crash`)
    return { flow, status: 'fail', durationMs: Date.now() - start, notes: String(err) }
  }
}

// ── 3. Quiz Flow ──────────────────────────────────────────────────────────────
async function testQuizFlow(page: Page): Promise<FlowResult> {
  const flow  = 'quiz-flow'
  const start = Date.now()
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 })

    const quizBtn = await page.$([
      'a[href*="quiz"]',
      'button:has-text("quiz")',
      'button:has-text("Empezar")',
      'button:has-text("Comenzar")',
      'button:has-text("Descubrir")',
      'a:has-text("Empezar")',
      'a:has-text("Comenzar")',
      'a:has-text("Descubrir")',
    ].join(', '))

    if (!quizBtn) {
      await shot(page, `${flow}-no-button`)
      return { flow, status: 'warn', durationMs: Date.now() - start, notes: 'Botón de inicio de quiz no encontrado' }
    }

    await quizBtn.click()
    await page.waitForTimeout(1500)

    let rounds = 0
    for (let i = 0; i < 10; i++) {
      const option = await page.$([
        'button[data-option]',
        'input[type="radio"]',
        '.quiz-option',
        '[role="radio"]',
      ].join(', '))
      if (!option) break

      await option.click()
      await page.waitForTimeout(500)

      const next = await page.$([
        'button:has-text("Siguiente")',
        'button:has-text("Continuar")',
        'button:has-text("siguiente")',
      ].join(', '))
      if (next) {
        await next.click()
        await page.waitForTimeout(800)
      }
      rounds++
    }

    await page.waitForTimeout(1500)
    await shot(page, flow)

    const url      = page.url()
    const bodyText = await page.evaluate(() => document.body.innerText)
    const hasResult =
      url.includes('result') || url.includes('quiz') ||
      bodyText.toLowerCase().includes('receta') ||
      bodyText.toLowerCase().includes('perfil') ||
      bodyText.toLowerCase().includes('resultado')

    return {
      flow,
      status: hasResult ? 'pass' : 'warn',
      durationMs: Date.now() - start,
      notes: hasResult
        ? `Quiz completado en ${rounds} rondas`
        : `Sin resultado claro tras ${rounds} rondas`,
      metrics: { rounds },
    }
  } catch (err: unknown) {
    await shot(page, `${flow}-crash`)
    return { flow, status: 'fail', durationMs: Date.now() - start, notes: String(err) }
  }
}

// ── 4. Email Capture ──────────────────────────────────────────────────────────
async function testEmailCapture(page: Page): Promise<FlowResult> {
  const flow  = 'email-capture'
  const start = Date.now()
  try {
    // Check current page first (wherever quiz flow left us)
    let emailInput = await page.$('input[type="email"]')

    if (!emailInput) {
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 })
      await page.waitForTimeout(500)
      emailInput = await page.$('input[type="email"]')
    }

    await shot(page, flow)

    return {
      flow,
      status: emailInput ? 'pass' : 'warn',
      durationMs: Date.now() - start,
      notes: emailInput
        ? 'Input de email encontrado'
        : 'No se encontró input de email en flujo actual ni en homepage',
    }
  } catch (err: unknown) {
    await shot(page, `${flow}-crash`)
    return { flow, status: 'fail', durationMs: Date.now() - start, notes: String(err) }
  }
}

// ── 5. Dashboard ──────────────────────────────────────────────────────────────
async function testDashboard(page: Page): Promise<FlowResult> {
  const flow  = 'dashboard'
  const start = Date.now()
  try {
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle', timeout: 30_000 })
    await page.waitForTimeout(500)

    const finalUrl       = page.url()
    const isOnDashboard  = finalUrl.includes('dashboard')
    const redirectedOk   = finalUrl.includes('login') || finalUrl.includes('auth') || finalUrl.includes('quiz')

    await shot(page, flow)

    if (isOnDashboard || redirectedOk) {
      return {
        flow, status: 'pass', durationMs: Date.now() - start,
        notes: isOnDashboard
          ? 'Dashboard accesible (sesión activa)'
          : `Redirigido correctamente → ${finalUrl}`,
        metrics: { redirected: redirectedOk ? 1 : 0 },
      }
    }

    return {
      flow, status: 'warn', durationMs: Date.now() - start,
      notes: `URL inesperada: ${finalUrl}`,
    }
  } catch (err: unknown) {
    await shot(page, `${flow}-crash`)
    return { flow, status: 'fail', durationMs: Date.now() - start, notes: String(err) }
  }
}

// ── 6. Freemium Gate ──────────────────────────────────────────────────────────
async function testFreemiumGate(page: Page): Promise<FlowResult> {
  const flow  = 'freemium-gate'
  const start = Date.now()
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 })
    await page.waitForTimeout(500)

    const bodyText = await page.evaluate(() => document.body.innerText)
    const markers  = ['Premium', '€9', 'Michelin·Mood', 'Suscrib']
    const found    = markers.filter(m => bodyText.includes(m))

    await shot(page, flow)

    return {
      flow,
      status: found.length > 0 ? 'pass' : 'warn',
      durationMs: Date.now() - start,
      notes: found.length > 0
        ? `Marcadores freemium: ${found.join(', ')}`
        : 'No se detectaron marcadores de freemium/premium en homepage',
      metrics: { markersFound: found.length },
    }
  } catch (err: unknown) {
    await shot(page, `${flow}-crash`)
    return { flow, status: 'fail', durationMs: Date.now() - start, notes: String(err) }
  }
}

// ── 7. Recipe Display ─────────────────────────────────────────────────────────
async function testRecipeDisplay(page: Page): Promise<FlowResult> {
  const flow  = 'recipe-display'
  const start = Date.now()
  try {
    const bodyText   = await page.evaluate(() => document.body.innerText)
    const keywords   = ['receta', 'ingrediente', 'preparación', 'minutos']
    const found      = keywords.filter(k => bodyText.toLowerCase().includes(k))
    const imageCount = await page.$$eval('img', imgs => imgs.length)

    await shot(page, flow)

    return {
      flow,
      status: found.length > 0 ? 'pass' : 'warn',
      durationMs: Date.now() - start,
      notes: found.length > 0
        ? `Palabras clave: ${found.join(', ')} · ${imageCount} imágenes`
        : `Sin palabras clave de receta · ${imageCount} imágenes`,
      metrics: { keywordsFound: found.length, imageCount },
    }
  } catch (err: unknown) {
    await shot(page, `${flow}-crash`)
    return { flow, status: 'fail', durationMs: Date.now() - start, notes: String(err) }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  ensureDirs()

  const now = new Date()
  const browser: Browser = await chromium.launch({ headless: true })
  const context: BrowserContext = await browser.newContext({
    locale:     'es-ES',
    timezoneId: 'Europe/Madrid',
    userAgent:  IPHONE14_UA,
    viewport:   { width: 1280, height: 800 },
  })
  const page: Page = await context.newPage()

  const runners = [
    testHomepage,
    testMobileViewport,
    testQuizFlow,
    testEmailCapture,
    testDashboard,
    testFreemiumGate,
    testRecipeDisplay,
  ]

  const flows: FlowResult[] = []

  for (const runner of runners) {
    try {
      const result = await runner(page)
      flows.push(result)
      const icon = result.status === 'pass' ? '✓' : result.status === 'warn' ? '⚠' : '✗'
      console.log(`[${icon}] ${result.flow}: ${result.notes} (${result.durationMs}ms)`)
    } catch (err: unknown) {
      const fallback: FlowResult = {
        flow: runner.name, status: 'fail', durationMs: 0,
        notes: `Error no capturado: ${String(err)}`,
      }
      flows.push(fallback)
      console.error(`[✗] ${fallback.flow}: ${fallback.notes}`)
    }
  }

  await browser.close()

  const summary = {
    total:   flows.length,
    passed:  flows.filter(f => f.status === 'pass').length,
    failed:  flows.filter(f => f.status === 'fail').length,
    warned:  flows.filter(f => f.status === 'warn').length,
  }

  const report: AuditReport = {
    date:    now.toISOString(),
    week:    getWeekNumber(now),
    baseUrl: BASE_URL,
    flows,
    summary,
  }

  fs.writeFileSync(path.join(RESULTS_DIR, 'latest.json'), JSON.stringify(report, null, 2))

  console.log('\n── Resumen ──────────────────────────────────────────')
  console.log(`✓ Pass: ${summary.passed}  ⚠ Warn: ${summary.warned}  ✗ Fail: ${summary.failed}`)

  if (summary.failed > 0) process.exit(1)
}

main()
