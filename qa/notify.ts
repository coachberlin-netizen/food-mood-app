import * as nodemailer from 'nodemailer'
import * as fs from 'fs'
import * as path from 'path'
import type { AuditReport, FlowResult } from './audit'
import type { DiffReport, Regression, Severity } from './compare'

// ── Paleta Food·Mood ──────────────────────────────────────────────────────────
const BURG  = '#6B2737'
const CREAM = '#F5F0E8'
const GOLD  = '#C9A84C'
const DARK  = '#2d0f16'

const SEVERITY_COLOR: Record<Severity, string> = {
  critical: '#DC2626',
  high:     '#EA580C',
  medium:   '#D97706',
  low:      '#2563EB',
}

const STATUS_COLOR: Record<FlowResult['status'], string> = {
  pass: '#16A34A',
  warn: '#D97706',
  fail: '#DC2626',
}

const STATUS_LABEL: Record<FlowResult['status'], string> = {
  pass: '✓ Pass',
  warn: '⚠ Warn',
  fail: '✗ Fail',
}

// ── Subject ───────────────────────────────────────────────────────────────────
function buildSubject(diff: DiffReport): string {
  if (!diff.hasRegressions) return '✅ Food·Mood QA — Sin regresiones esta semana'

  const hasCriticalOrHigh = diff.regressions.some(
    r => r.severity === 'critical' || r.severity === 'high'
  )
  const n = diff.regressions.length

  return hasCriticalOrHigh
    ? `🔴 Food·Mood QA — ${n} regresión${n > 1 ? 'es' : ''} crítica${n > 1 ? 's' : ''} detectada${n > 1 ? 's' : ''}`
    : `🟡 Food·Mood QA — ${n} issue${n > 1 ? 's' : ''} detectado${n > 1 ? 's' : ''}`
}

// ── Helpers HTML ──────────────────────────────────────────────────────────────
function td(content: string, style = ''): string {
  return `<td style="padding:8px 12px;border-bottom:1px solid #e8ddd5;font-size:13px;${style}">${content}</td>`
}

function badge(label: string, color: string): string {
  return `<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${color}20;color:${color};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em">${label}</span>`
}

function severityBadge(s: Severity): string {
  return badge(s, SEVERITY_COLOR[s])
}

function statusBadge(s: FlowResult['status']): string {
  return badge(STATUS_LABEL[s], STATUS_COLOR[s])
}

// ── HTML Email ────────────────────────────────────────────────────────────────
function buildHtml(report: AuditReport, diff: DiffReport, runUrl: string): string {
  const year       = new Date().getFullYear()
  const isOk       = !diff.hasRegressions
  const bannerBg   = isOk ? '#16A34A' : diff.regressions.some(r => r.severity === 'critical' || r.severity === 'high') ? '#DC2626' : '#D97706'
  const bannerText = isOk ? '✅ Todo OK' : diff.hasRegressions ? `⚠ ${diff.regressions.length} regresión${diff.regressions.length > 1 ? 'es' : ''} detectada${diff.regressions.length > 1 ? 's' : ''}` : '✅ Todo OK'

  const weekLabel = new Date(report.date).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  // Stats row
  const statsRow = `
    <tr>
      <td style="padding:24px;text-align:center">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            ${[
              { label: 'Pass', value: report.summary.passed, color: '#16A34A' },
              { label: 'Warn', value: report.summary.warned, color: '#D97706' },
              { label: 'Fail', value: report.summary.failed, color: '#DC2626' },
            ].map(s => `
              <td style="text-align:center;padding:0 16px">
                <div style="font-size:32px;font-weight:900;color:${s.color}">${s.value}</div>
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#9e8080;margin-top:2px">${s.label}</div>
              </td>
            `).join('')}
          </tr>
        </table>
      </td>
    </tr>`

  // Regressions table
  const regressionsSection = diff.regressions.length > 0 ? `
    <tr><td style="padding:0 24px 8px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9e8080;margin-bottom:8px">Regresiones</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #e8ddd5">
        <thead>
          <tr style="background:#faf9f7">
            ${['Flujo','Antes','Después','Severidad','Detalle'].map(h =>
              `<th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9e8080">${h}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${diff.regressions.map((r: Regression) => `
            <tr>
              ${td(`<strong style="color:${DARK}">${r.flow}</strong>`)}
              ${td(statusBadge(r.before as FlowResult['status']))}
              ${td(statusBadge(r.after as FlowResult['status']))}
              ${td(severityBadge(r.severity))}
              ${td(r.notes, 'color:#6b5555')}
            </tr>`).join('')}
        </tbody>
      </table>
    </td></tr>` : ''

  // Improvements table
  const improvementsSection = diff.improvements.length > 0 ? `
    <tr><td style="padding:0 24px 8px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9e8080;margin-bottom:8px">Mejoras</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #e8ddd5">
        <tbody>
          ${diff.improvements.map(i => `
            <tr>
              ${td(`<strong style="color:${DARK}">${i.flow}</strong>`)}
              ${td(statusBadge(i.before as FlowResult['status']))}
              <td style="padding:8px 12px;font-size:18px">→</td>
              ${td(statusBadge(i.after as FlowResult['status']))}
            </tr>`).join('')}
        </tbody>
      </table>
    </td></tr>` : ''

  // All flows detail
  const flowsDetail = `
    <tr><td style="padding:0 24px 8px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#9e8080;margin-bottom:8px">Detalle de flujos</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #e8ddd5">
        <thead>
          <tr style="background:#faf9f7">
            ${['Flujo','Estado','Duración','Notas'].map(h =>
              `<th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#9e8080">${h}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${report.flows.map(f => `
            <tr>
              ${td(`<strong style="color:${DARK}">${f.flow}</strong>`)}
              ${td(statusBadge(f.status))}
              ${td(`${Math.round(f.durationMs)}ms`, 'color:#9e8080;font-variant-numeric:tabular-nums')}
              ${td(f.notes, 'color:#6b5555;max-width:260px')}
            </tr>`).join('')}
        </tbody>
      </table>
    </td></tr>`

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${CREAM};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM}">
  <tr><td align="center" style="padding:32px 16px">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

      <!-- Banner -->
      <tr>
        <td style="background:${bannerBg};border-radius:16px 16px 0 0;padding:20px 24px;text-align:center">
          <div style="font-size:20px;font-weight:900;color:#fff;letter-spacing:0.02em">${bannerText}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.75);margin-top:4px">${weekLabel}</div>
        </td>
      </tr>

      <!-- Logo -->
      <tr>
        <td style="background:#fff;padding:16px 24px;border-left:1px solid #e8ddd5;border-right:1px solid #e8ddd5">
          <span style="font-size:18px;font-weight:900;color:${BURG};letter-spacing:0.04em">Food·Mood</span>
          <span style="font-size:12px;color:#9e8080;margin-left:8px">QA Semanal</span>
        </td>
      </tr>

      <!-- Stats -->
      <tr>
        <td style="background:#fff;border-left:1px solid #e8ddd5;border-right:1px solid #e8ddd5">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${statsRow}
          </table>
        </td>
      </tr>

      <!-- Divider -->
      <tr><td style="background:#fff;padding:0 24px;border-left:1px solid #e8ddd5;border-right:1px solid #e8ddd5">
        <hr style="border:none;border-top:1px solid #e8ddd5;margin:0">
      </td></tr>

      <!-- Content -->
      <tr><td style="background:#fff;padding:24px 0;border-left:1px solid #e8ddd5;border-right:1px solid #e8ddd5">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${regressionsSection}
          ${improvementsSection}
          ${flowsDetail}
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td style="background:#fff;padding:0 24px 28px;text-align:center;border-left:1px solid #e8ddd5;border-right:1px solid #e8ddd5">
        <a href="${runUrl}"
          style="display:inline-block;background:${BURG};color:#fff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 28px;border-radius:999px;margin-right:12px">
          Ver ejecución en GitHub →
        </a>
        <a href="https://food-mood.app"
          style="display:inline-block;border:1px solid ${BURG}20;color:${BURG};text-decoration:none;font-size:13px;font-weight:600;padding:12px 20px;border-radius:999px">
          food-mood.app
        </a>
      </td></tr>

      <!-- Footer -->
      <tr>
        <td style="background:${DARK};border-radius:0 0 16px 16px;padding:16px 24px;text-align:center">
          <div style="font-size:12px;color:rgba(245,240,232,0.55)">
            Food·Mood · <a href="https://food-mood.app" style="color:${GOLD};text-decoration:none">food-mood.app</a> · © ${year}
          </div>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

// ── Attachments ───────────────────────────────────────────────────────────────
function collectAttachments(
  report: AuditReport,
  screenshotsDir: string
): nodemailer.SendMailOptions['attachments'] {
  if (!fs.existsSync(screenshotsDir)) return []

  const problemFlows = new Set(
    report.flows
      .filter(f => f.status !== 'pass')
      .map(f => f.flow)
  )

  return fs.readdirSync(screenshotsDir)
    .filter(f => f.endsWith('.png'))
    .filter(f => {
      const base = path.basename(f, '.png')
      return Array.from(problemFlows).some(flow => base.startsWith(flow))
    })
    .map(f => ({
      filename: f,
      path:     path.join(screenshotsDir, f),
      cid:      f,
    }))
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const RESULTS_DIR     = path.join(__dirname, 'results')
  const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots')

  const diffPath   = path.join(RESULTS_DIR, 'diff.json')
  const reportPath = path.join(RESULTS_DIR, 'latest.json')

  if (!fs.existsSync(diffPath) || !fs.existsSync(reportPath)) {
    console.error('Faltan qa/results/diff.json o latest.json — ejecuta audit.ts y compare.ts primero.')
    process.exit(1)
  }

  const diff: DiffReport     = JSON.parse(fs.readFileSync(diffPath,   'utf-8'))
  const report: AuditReport  = JSON.parse(fs.readFileSync(reportPath, 'utf-8'))

  const forceEmail = process.env.FORCE_EMAIL === 'true'

  if (!diff.hasRegressions && !forceEmail) {
    console.log('Sin regresiones y FORCE_EMAIL no activo — no se envía email.')
    return
  }

  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_APP_PASSWORD
  const notifyTo  = process.env.NOTIFY_EMAIL
  const runUrl    = process.env.GITHUB_RUN_URL ?? 'https://github.com'

  if (!gmailUser || !gmailPass || !notifyTo) {
    console.error(
      'Variables de entorno faltantes: GMAIL_USER, GMAIL_APP_PASSWORD y NOTIFY_EMAIL son obligatorias.'
    )
    process.exit(1)
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  const subject     = buildSubject(diff)
  const html        = buildHtml(report, diff, runUrl)
  const attachments = collectAttachments(report, SCREENSHOTS_DIR)

  await transporter.sendMail({
    from:        `"Food·Mood QA" <${gmailUser}>`,
    to:          notifyTo,
    subject,
    html,
    attachments,
  })

  console.log(`Email enviado → ${notifyTo}`)
  console.log(`Subject: ${subject}`)
  if (attachments.length > 0) {
    console.log(`Adjuntos: ${attachments.map(a => a.filename).join(', ')}`)
  }
}

main()
