import * as fs from 'fs'
import * as path from 'path'
import type { AuditReport, FlowResult } from './audit'

export type Severity = 'critical' | 'high' | 'medium' | 'low'

export interface Regression {
  flow: string
  before: string
  after: string
  severity: Severity
  notes: string
}

export interface Improvement {
  flow: string
  before: string
  after: string
}

export interface DiffReport {
  date: string
  hasRegressions: boolean
  regressions: Regression[]
  improvements: Improvement[]
  unchanged: string[]
  newFlows: string[]
  currentSummary: AuditReport['summary']
  previousSummary?: AuditReport['summary']
}

const CRITICAL_FLOWS = ['homepage', 'quiz-flow']

const STATUS_ORDER: Record<FlowResult['status'], number> = { pass: 0, warn: 1, fail: 2 }

function getSeverity(
  flow: string,
  before: FlowResult['status'],
  after: FlowResult['status'],
  beforeMs?: number,
  afterMs?: number
): Severity {
  if (after === 'fail' && CRITICAL_FLOWS.includes(flow)) return 'critical'
  if (after === 'fail') return 'high'
  if (before === 'pass' && after === 'warn') return 'medium'
  if (beforeMs !== undefined && afterMs !== undefined && afterMs > beforeMs * 1.2) return 'low'
  return 'low'
}

function main(): void {
  const RESULTS_DIR  = path.join(__dirname, 'results')
  const PREVIOUS_DIR = process.env.PREVIOUS_RESULTS_DIR
    ? path.resolve(__dirname, process.env.PREVIOUS_RESULTS_DIR)
    : path.join(__dirname, 'previous')

  const currentPath  = path.join(RESULTS_DIR, 'latest.json')
  const previousPath = path.join(PREVIOUS_DIR, 'latest.json')

  if (!fs.existsSync(currentPath)) {
    console.error('No se encontró qa/results/latest.json — ejecuta audit.ts primero.')
    process.exit(1)
  }

  const current: AuditReport = JSON.parse(fs.readFileSync(currentPath, 'utf-8'))

  // Sin resultados previos → diff vacío, termina sin error
  if (!fs.existsSync(previousPath)) {
    console.log('No hay resultados previos. Primera ejecución — diff vacío guardado.')
    const empty: DiffReport = {
      date:            new Date().toISOString(),
      hasRegressions:  false,
      regressions:     [],
      improvements:    [],
      unchanged:       [],
      newFlows:        current.flows.map(f => f.flow),
      currentSummary:  current.summary,
    }
    fs.mkdirSync(RESULTS_DIR, { recursive: true })
    fs.writeFileSync(path.join(RESULTS_DIR, 'diff.json'), JSON.stringify(empty, null, 2))
    return
  }

  const previous: AuditReport = JSON.parse(fs.readFileSync(previousPath, 'utf-8'))
  const prevMap = new Map(previous.flows.map(f => [f.flow, f]))

  const regressions: Regression[] = []
  const improvements: Improvement[] = []
  const unchanged: string[] = []
  const newFlows: string[] = []

  for (const curr of current.flows) {
    const prev = prevMap.get(curr.flow)

    if (!prev) {
      newFlows.push(curr.flow)
      continue
    }

    const statusDegraded = STATUS_ORDER[curr.status] > STATUS_ORDER[prev.status]
    const statusImproved = STATUS_ORDER[curr.status] < STATUS_ORDER[prev.status]
    const slowerBy20 =
      curr.status === prev.status &&
      curr.status !== 'fail' &&
      curr.durationMs > prev.durationMs * 1.2

    if (statusDegraded || slowerBy20) {
      const severity = getSeverity(
        curr.flow, prev.status, curr.status, prev.durationMs, curr.durationMs
      )
      const perfNote = slowerBy20
        ? ` · rendimiento: ${Math.round(prev.durationMs)}ms → ${Math.round(curr.durationMs)}ms`
        : ''
      regressions.push({
        flow:     curr.flow,
        before:   prev.status,
        after:    curr.status,
        severity,
        notes:    `${prev.status} → ${curr.status}${perfNote}`,
      })
    } else if (statusImproved) {
      improvements.push({ flow: curr.flow, before: prev.status, after: curr.status })
    } else {
      unchanged.push(curr.flow)
    }
  }

  const diff: DiffReport = {
    date:            new Date().toISOString(),
    hasRegressions:  regressions.length > 0,
    regressions,
    improvements,
    unchanged,
    newFlows,
    currentSummary:  current.summary,
    previousSummary: previous.summary,
  }

  fs.mkdirSync(RESULTS_DIR, { recursive: true })
  fs.writeFileSync(path.join(RESULTS_DIR, 'diff.json'), JSON.stringify(diff, null, 2))

  console.log(
    `Regresiones: ${regressions.length} | ` +
    `Mejoras: ${improvements.length} | ` +
    `Sin cambios: ${unchanged.length} | ` +
    `Nuevos: ${newFlows.length}`
  )

  if (regressions.length > 0) {
    console.log('\nRegresiones detectadas:')
    for (const r of regressions) {
      console.log(`  [${r.severity.toUpperCase()}] ${r.flow}: ${r.notes}`)
    }
  }
}

main()
