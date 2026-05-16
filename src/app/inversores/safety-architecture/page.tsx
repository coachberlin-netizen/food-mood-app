'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const s = {
  page: {
    backgroundColor: '#F9F7F2',
    minHeight: '100vh',
    fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
  } as React.CSSProperties,
  topbar: {
    backgroundColor: '#0f0608',
    padding: '12px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    printNone: true,
  } as React.CSSProperties,
  doc: {
    maxWidth: 780,
    margin: '0 auto',
    padding: '48px 48px 80px',
    fontSize: 10.5,
    lineHeight: 1.65,
    color: '#1A1612',
  } as React.CSSProperties,
}

function Mono({ children, color = '#5A4E48' }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color }}>
      {children}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'monospace',
      fontSize: 7.5,
      letterSpacing: '0.2em',
      textTransform: 'uppercase' as const,
      color: '#3A8C62',
      marginTop: 32,
      marginBottom: 12,
      paddingBottom: 5,
      borderBottom: '1.5px solid #E0EDE6',
    }}>
      {children}
    </div>
  )
}

function Layer({
  number,
  title,
  when,
  action,
  result,
  evidence,
}: {
  number: string
  title: string
  when: string
  action: string
  result: string
  evidence?: string
}) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '28px 1fr',
      gap: 16,
      marginBottom: 16,
      pageBreakInside: 'avoid' as const,
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        backgroundColor: '#3A8C62',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: 10,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
      }}>
        {number}
      </div>
      <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#1A1612', margin: '0 0 6px' }}>{title}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#5A4E48', marginBottom: 3 }}>Cuándo actúa</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.6, margin: 0 }}>{when}</p>
          </div>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#5A4E48', marginBottom: 3 }}>Resultado</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.6, margin: 0 }}>{result}</p>
          </div>
        </div>
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #F0EDE4' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#5A4E48', marginBottom: 3 }}>Acción del sistema</p>
          <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.6, margin: 0 }}>{action}</p>
        </div>
        {evidence && (
          <div style={{ marginTop: 8 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#3A8C62', marginBottom: 3 }}>Base clínica</p>
            <p style={{ fontSize: 9.5, color: '#3D3028', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>{evidence}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SafetyArchitecturePage() {
  const router = useRouter()
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/inversores/check-auth').then(r => {
      if (r.ok) setAuthed(true)
      else setAuthed(false)
    }).catch(() => setAuthed(false))
  }, [])

  useEffect(() => {
    if (authed === false) router.replace('/inversores')
  }, [authed, router])

  if (authed !== true) return null

  return (
    <div style={s.page}>
      {/* Top bar — hidden on print */}
      <div className="no-print" style={s.topbar}>
        <p style={{ fontFamily: 'serif', fontSize: 18, color: '#F5F0E8', fontWeight: 700, margin: 0 }}>
          Food<span style={{ color: '#C9A84C' }}>·</span>Mood
        </p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => router.back()}
            style={{ fontSize: 11, color: 'rgba(245,240,232,0.6)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}
          >
            ← Volver
          </button>
          <button
            onClick={() => window.print()}
            style={{
              backgroundColor: '#C9A84C',
              color: '#0f0608',
              fontWeight: 700,
              fontSize: 12,
              padding: '9px 22px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            Guardar como PDF ↓
          </button>
        </div>
      </div>

      {/* Document */}
      <div style={s.doc}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #1A1612', paddingBottom: 14, marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'serif', fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', color: '#1A1612', lineHeight: 1 }}>
              Food<span style={{ color: '#3A8C62' }}>·</span>Mood
            </div>
            <div style={{ fontFamily: 'serif', fontSize: 14, color: '#3D3028', marginTop: 4 }}>
              Clinical AI Safety Architecture
            </div>
          </div>
          <div style={{ textAlign: 'right', lineHeight: 1.7 }}>
            <Mono>Technical Due Diligence · Confidential</Mono><br />
            <Mono>May 2026 · v1.0</Mono>
          </div>
        </div>

        {/* Executive summary */}
        <div style={{ background: '#F0EDE4', border: '1px solid #D8D0C4', borderLeft: '4px solid #3A8C62', borderRadius: '0 6px 6px 0', padding: '16px 20px', marginBottom: 28 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#3A8C62', marginBottom: 8 }}>Executive Summary</p>
          <p style={{ fontSize: 11, color: '#1A1612', lineHeight: 1.7, margin: 0 }}>
            Food·Mood&apos;s AI Digital Advisor uses Anthropic Claude as the underlying language model, wrapped in a four-layer safety filter pipeline. The pipeline intercepts sensitive signals <strong>before they reach the model</strong>, validates every AI-generated recommendation against user health data, and routes to professional resources when safety cannot be guaranteed. The safety layer was designed by the founder in her capacity as a licensed psychologist, is covered by automated tests, and is structured for EU AI Act compliance (full applicability: 2027). Food·Mood operates as a <strong>wellness and lifestyle application</strong> — not a medical device — in accordance with MDCG 2025-4 guidance.
          </p>
        </div>

        {/* Pipeline overview */}
        <SectionTitle>Pipeline Overview</SectionTitle>
        <p style={{ fontSize: 10.5, color: '#3D3028', lineHeight: 1.65, marginBottom: 20 }}>
          Every user interaction passes through the following sequence. Steps 1–2 run pre-LLM (no model call is made when a crisis or TCA signal is detected). Steps 3–5 run post-LLM on the structured response before it is delivered to the user.
        </p>

        {/* Flow diagram */}
        <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 8, padding: '24px 28px', marginBottom: 28, pageBreakInside: 'avoid' as const }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' as const, justifyContent: 'center', rowGap: 8 }}>
            {[
              { label: 'User input', color: '#E0EDE6', text: '#3D3028' },
              null,
              { label: '① Crisis detection', color: '#FFF3CD', text: '#7B5E00' },
              null,
              { label: '② TCA detection', color: '#FFF3CD', text: '#7B5E00' },
              null,
              { label: '③ LLM call', color: '#E8F4F0', text: '#1A5C3A' },
              null,
              { label: '④ Schema parse', color: '#E8F4F0', text: '#1A5C3A' },
              null,
              { label: '⑤ Post-flight checks', color: '#FFF3CD', text: '#7B5E00' },
              null,
              { label: 'Response delivered', color: '#E0EDE6', text: '#3D3028' },
            ].map((node, i) =>
              node === null ? (
                <div key={i} style={{ color: '#C0B8B0', fontSize: 14, padding: '0 4px' }}>→</div>
              ) : (
                <div key={i} style={{
                  background: node.color,
                  color: node.text,
                  padding: '6px 12px',
                  borderRadius: 4,
                  fontSize: 9,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  letterSpacing: '0.04em',
                  textAlign: 'center' as const,
                  whiteSpace: 'nowrap' as const,
                }}>
                  {node.label}
                </div>
              )
            )}
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' as const }}>
            {[
              { color: '#FFF3CD', border: '#E8D080', label: 'Safety gate — may derive or block' },
              { color: '#E8F4F0', border: '#B0D4C4', label: 'Core processing' },
              { color: '#E0EDE6', border: '#C0D0C8', label: 'Data boundary' },
            ].map(({ color, border, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, background: color, border: `1px solid ${border}`, borderRadius: 2 }} />
                <span style={{ fontSize: 8.5, color: '#5A4E48', fontFamily: 'monospace' }}>{label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9, color: '#5A4E48', marginTop: 14, textAlign: 'center' as const, fontStyle: 'italic', lineHeight: 1.5 }}>
            Post-flight (⑤) includes: allergen validation → drug-food interaction check → brand sanitization
          </p>
        </div>

        {/* The four layers */}
        <SectionTitle>The Four Safety Layers</SectionTitle>

        <Layer
          number="1"
          title="Pre-flight Crisis Detection"
          when="Immediately on user input, before any LLM call"
          action="Pattern matching against 7 regex expressions covering direct suicidal ideation, passive ideation, and self-harm intent. If any pattern matches, the pipeline short-circuits: the LLM is never invoked."
          result="Structured derivation response with country-specific crisis resources (Spain: 024 line, Teléfono de la Esperanza; Mexico: SAPTEL). Message: empathic, non-prescriptive, human-first."
          evidence="False negatives (missed crisis signals) are treated as the primary failure mode — the threshold is intentionally low. False positives (unnecessary derivation for ambiguous phrasing) are acceptable. Pattern library reviewed by the founder as a licensed mental health professional."
        />

        <Layer
          number="2"
          title="Pre-flight Eating Disorder (TCA) Detection"
          when="Immediately after crisis check, before any LLM call"
          action="9 regex patterns covering restriction, purging, caloric compensation, merit-based eating cognitions ('no merezco comer'), and explicit caloric restriction language. Same short-circuit logic as crisis detection."
          result="Structured derivation to specialist services (Spain: FEACAB, ACAB Cataluña; Mexico: Comenzar de Nuevo A.C.). The app does not attempt to engage with or address the symptom — it steps aside entirely."
          evidence="Eating disorder detection in digital health requires conservative thresholds. A wellness app continuing to serve recipe recommendations to a user displaying TCA signals would be clinically inappropriate regardless of the user's stated intent."
        />

        <Layer
          number="3"
          title="Allergen Validation"
          when="After LLM response, before delivery — mode: recomendacion only"
          action="Each ingredient in the AI-generated recipe is normalised (NFD Unicode, lowercase) and checked against the user's declared allergen list via substring match. The check is bidirectional: 'arándano' matches 'arándanos azules'."
          result="Hard block: throws SafetyViolation error. The recommendation is never delivered. The user sees a safety message; no ingredient substitution is attempted."
          evidence="Allergen substitution by an AI model is not clinically safe — a hard block is the only appropriate response. The error is surfaced to the frontend for user messaging."
        />

        <Layer
          number="4"
          title="Drug-Food Interaction Routing"
          when="After allergen check — mode: recomendacion only"
          action={`Ingredient list checked against a curated drug-interaction database (6 drug classes: warfarin, MAOIs, atorvastatin, levothyroxine, sertraline, tranylcypromine). Two response paths: (a) BLOCKING interactions (e.g. MAOI + aged cheese → tyramine crisis risk) → derive to pharmacist; (b) CAUTION interactions (e.g. warfarin + vitamin K foods) → append warning to advertencias array without blocking.`}
          result="Blocking: structured pharmacist derivation. Caution: recommendation delivered with appended clinical warning visible to the user."
          evidence="Drug-food interaction severity varies by mechanism. MAOI-tyramine and statin-grapefruit interactions are well-documented with serious adverse event potential; warfarin-vitamin K interactions require monitoring but do not constitute an absolute contraindication. The two-path model reflects clinical nuance."
        />

        {/* Design decisions */}
        <SectionTitle>Key Design Decisions</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
          {[
            {
              decision: 'Pre-LLM gates, not post-processing filters',
              rationale: 'Running crisis and TCA detection before the LLM call ensures that sensitive signals are never processed by a model that could respond in clinically inappropriate ways. The LLM never "sees" a crisis input.',
            },
            {
              decision: 'Hard blocks for allergens, not warnings',
              rationale: 'An allergen warning that still delivers the recommendation shifts liability to the user. A hard block is the only approach that eliminates risk. The additional friction is intentional.',
            },
            {
              decision: 'Derivation, not diagnosis',
              rationale: 'The system never attempts to assess, classify, or respond to a clinical condition. It detects a signal and routes to professionals. This keeps Food·Mood firmly in the wellness category and outside the scope of medical device regulation.',
            },
            {
              decision: 'Country-specific resource mapping',
              rationale: 'Crisis resources are local emergency services and specialist organisations, not generic wellness advice. A Spanish user needs the 024 line; a Mexican user needs SAPTEL. Generic global resources would reduce the effectiveness of the derivation.',
            },
            {
              decision: 'Schema-enforced response structure',
              rationale: 'All LLM outputs are validated against a Zod discriminated union schema before safety checks run. An LLM response that does not conform to the schema is rejected entirely — it cannot bypass safety gates through unexpected output shapes.',
            },
          ].map(({ decision, rationale }) => (
            <div key={decision} style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16, padding: '12px 0', borderBottom: '1px solid #F0EDE4' }}>
              <div>
                <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#3A8C62', marginBottom: 4 }}>Design decision</p>
                <p style={{ fontSize: 10, color: '#1A1612', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>{decision}</p>
              </div>
              <div>
                <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#5A4E48', marginBottom: 4 }}>Rationale</p>
                <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, margin: 0 }}>{rationale}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Test coverage */}
        <SectionTitle>Automated Test Coverage</SectionTitle>
        <p style={{ fontSize: 10.5, color: '#3D3028', lineHeight: 1.65, marginBottom: 14 }}>
          The safety pipeline is covered by 5 automated tests (Vitest) that run on every build. Tests exercise the full pipeline from input to output, not individual functions in isolation.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 10 }}>
          <thead>
            <tr>
              {['Test case', 'Input', 'Expected outcome'].map(h => (
                <th key={h} style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#5A4E48', padding: '0 12px 8px 0', textAlign: 'left' as const, borderBottom: '1.5px solid #E0EDE6', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Crisis pre-flight gate', '"no quiero seguir aquí"', 'modo: derivar · tipo: crisis_emocional · LLM not called'],
              ['Allergen hard block', 'Profile: allergies: ["arándano"] · recipe with arándanos', 'Throws SafetyViolation · recommendation never delivered'],
              ['Drug caution — warning appended', 'Profile: medications: ["warfarina"] · recipe with matcha', 'modo: recomendacion · advertencias.length > 0'],
              ['Drug blocking — pharmacist derivation', 'Profile: medications: ["fenelzina"] · recipe with queso curado', 'modo: derivar · tipo: farmaceutico'],
              ['Brand sanitization', 'LLM returns recipe with brand name "UMYKO"', 'Brand replaced with generic "kombucha artesanal" in ingredientes + pasos'],
            ].map(([test, input, expected], i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F0EDE4' }}>
                <td style={{ padding: '8px 12px 8px 0', color: '#1A1612', fontSize: 10, fontWeight: 500, verticalAlign: 'top' }}>{test}</td>
                <td style={{ padding: '8px 12px 8px 0', color: '#3D3028', fontSize: 9.5, fontFamily: 'monospace', lineHeight: 1.6, verticalAlign: 'top' }}>{input}</td>
                <td style={{ padding: '8px 0', color: '#3A8C62', fontSize: 9.5, fontFamily: 'monospace', lineHeight: 1.6, verticalAlign: 'top' }}>{expected}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 9, color: '#5A4E48', marginTop: 8, fontStyle: 'italic' }}>
          All 5 tests pass. Test file: <Mono color="#3A8C62">src/agent/safety/__tests__/middleware.test.ts</Mono>
        </p>

        {/* Regulatory positioning */}
        <SectionTitle>Regulatory Positioning</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            {
              reg: 'EU AI Act (2025)',
              classification: 'Limited risk — NOT high-risk',
              note: 'Food·Mood does not make medical diagnoses, influence clinical decisions, or process biometric data for identification. The safety pipeline ensures the system steps aside (derives) rather than responding to clinical situations — keeping it outside the high-risk AI category.',
            },
            {
              reg: 'MDR / IVDR + MDCG 2025-4',
              classification: 'Lifestyle app — NOT medical device software',
              note: 'The EU Medical Device Regulation and MDCG 2025-4 guidance distinguish between Medical Device Software (MDSW) and wellness/lifestyle apps. Food·Mood makes no efficacy claims, diagnoses no conditions, and influences no clinical decisions. The derivation architecture (routing to professionals when clinical signals appear) is specifically designed to stay on the lifestyle side of this line.',
            },
            {
              reg: 'NIS2 / EHDS',
              classification: 'Standard cybersecurity + data portability',
              note: 'NIS2 Directive applies to digital service providers above a size threshold — currently not triggered. European Health Data Space (EHDS) regulation introduces data portability rights for health data; Food·Mood\'s GDPR-first architecture is compatible with EHDS secondary use restrictions. Both are monitored as the regulatory timeline evolves.',
            },
            {
              reg: 'GDPR / Data minimisation',
              classification: 'Compliant by design',
              note: 'Health profile data (allergies, medications, conditions) is used exclusively for safety validation, never stored in analytics, and never passed to the LLM in identifiable form. Pattern detection runs locally without external API calls.',
            },
            {
              reg: 'Consumer protection (health claims)',
              classification: 'Wellness positioning only',
              note: 'No therapeutic claims are made. Recipes are positioned as functional food for emotional wellbeing. The system explicitly avoids language around diagnosis, treatment, or medical efficacy.',
            },
          ].map(({ reg, classification, note }) => (
            <div key={reg} style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 16px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 7.5, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#5A4E48', marginBottom: 4 }}>{reg}</p>
              <p style={{ fontSize: 10, color: '#3A8C62', fontWeight: 600, marginBottom: 6 }}>{classification}</p>
              <p style={{ fontSize: 9.5, color: '#2A2218', lineHeight: 1.6, margin: 0 }}>{note}</p>
            </div>
          ))}
        </div>

        {/* Authorship */}
        <SectionTitle>Authorship &amp; Clinical Review</SectionTitle>
        <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 8, padding: '20px 24px' }}>
          <div style={{ fontFamily: 'serif', fontSize: 13, fontWeight: 700, color: '#1A1612', marginBottom: 2 }}>Susana Ferreras Diez</div>
          <div style={{ fontFamily: 'monospace', fontSize: 7.5, letterSpacing: '0.1em', color: '#3A8C62', textTransform: 'uppercase' as const, marginBottom: 12 }}>CEO &amp; Founder · Psychologist · MSc Food Biotechnology · MSc Gerontology</div>
          <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, margin: 0 }}>
            The crisis detection patterns, TCA signal library, and clinical derivation logic were designed and reviewed by the founder in her professional capacity as a psychologist. The drug-food interaction database was compiled from established pharmacological references and is intended for expansion through pharmacist advisory review. The system is designed to be curated by clinical professionals — not to replace their judgment.
          </p>
        </div>

        {/* Honest investor Q&A */}
        <SectionTitle>Investor Q&amp;A — Honest Answers</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 8 }}>
          {[
            {
              q: 'Is this "clinical AI" or a general LLM with a safety filter?',
              a: 'The latter, stated honestly: the reasoning engine is Anthropic Claude (a general-purpose LLM). The value is in the operational layer — the safety filter pipeline, the curated knowledge base, and the human review process designed by a clinical professional. This is the right architecture for a wellness app at this stage. "Clinical AI" would imply regulatory approval under MDR, which we do not pursue.',
            },
            {
              q: 'Who is liable if a recommendation causes harm?',
              a: 'Food·Mood operates as a wellness education platform. The Terms of Service explicitly position recommendations as informational, not medical advice. The safety pipeline is designed to eliminate the highest-risk scenarios (crisis, allergens, drug interactions). Liability coverage is being scoped as part of legal setup; a Clinical Advisory Board with defined oversight responsibilities is on the Q1 2027 roadmap.',
            },
            {
              q: 'Does human review scale?',
              a: 'Phase 1 (launch): knowledge base is human-curated; the LLM selects from validated content. Phase 2 (Q3 2027): automated sampling of 10% of outputs with clinical spot-check. Phase 3 (Seed): guardrails handle low-risk categories automatically; human review reserved for edge cases. The pipeline is designed for this transition — the safety gates do not change, only the review cadence.',
            },
            {
              q: 'What are the KPIs for the AI agent?',
              a: 'Tracked from launch: recommendation acceptance rate (user completes recipe), D7/D30 retention cohorts, NPS post-interaction, escalation rate (% of interactions that trigger derivation), and inference cost per interaction. Target: <€0.008/interaction at current model pricing.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 7.5, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase' as const, marginBottom: 6, lineHeight: 1.5 }}>Q — {q}</p>
              <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 14, borderTop: '1px solid #E0EDE6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' as const, gap: 12 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: '#3A8C62', letterSpacing: '0.08em', lineHeight: 1.7 }}>
            www.food-mood.app · info@food-mood.app
          </div>
          <div style={{ fontSize: 7.5, color: '#5A4E48', textAlign: 'right' as const, lineHeight: 1.5 }}>
            Confidential — Do not distribute without authorisation<br />
            Food·Mood Pre-Seed 2026
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          @page { margin: 0.8cm 1.2cm; size: A4; }
        }
      `}</style>
    </div>
  )
}
