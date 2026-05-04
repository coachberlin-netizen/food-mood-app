import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Inversores · Food·Mood Pre-Seed 2026',
  description: 'Información confidencial para inversores. Acceso restringido.',
  robots: { index: false, follow: false },
}

const PASSWORD = 'FOODMOOD2026'
const COOKIE   = 'inv_auth'

async function verifyPassword(formData: FormData) {
  'use server'
  const cookieStore = await cookies()
  if (formData.get('password') === PASSWORD) {
    cookieStore.set(COOKIE, 'true', {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      maxAge:   60 * 60 * 24 * 7,
    })
    redirect('/inversores')
  }
  redirect('/inversores?error=1')
}

function Gate({ wrong }: { wrong: boolean }) {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#0f0608', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontFamily: 'serif', fontSize: 28, color: '#F5F0E8', fontWeight: 700, marginBottom: 6 }}>
            Food<span style={{ color: '#C9A84C' }}>·</span>Mood
          </p>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', marginBottom: 24 }}>
            Pre-Seed · Acceso para inversores
          </p>
          <p style={{ fontSize: 14, color: 'rgba(245,240,232,0.5)', lineHeight: 1.6 }}>
            Este área es confidencial. Introduce la clave de acceso que has recibido.
          </p>
        </div>

        <form action={verifyPassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            name="password"
            type="password"
            placeholder="Clave de acceso"
            autoComplete="off"
            required
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: 12,
              border: wrong ? '1.5px solid #c0392b' : '1.5px solid rgba(201,168,76,0.25)',
              backgroundColor: 'rgba(245,240,232,0.05)',
              color: '#F5F0E8',
              fontSize: 15,
              outline: 'none',
              textAlign: 'center',
              letterSpacing: '0.08em',
            }}
          />
          {wrong && (
            <p style={{ fontSize: 12, color: '#e74c3c', marginTop: -4 }}>
              Clave incorrecta. Verifica y vuelve a intentarlo.
            </p>
          )}
          <button
            type="submit"
            style={{
              backgroundColor: '#C9A84C',
              color: '#0f0608',
              fontWeight: 700,
              fontSize: 14,
              padding: '14px 24px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            Acceder →
          </button>
        </form>

        <p style={{ marginTop: 28, fontSize: 11, color: 'rgba(245,240,232,0.2)' }}>
          ¿Sin clave? Escribe a info@food-mood.app
        </p>
      </div>
    </main>
  )
}

function InvestorDeck() {
  return (
    <main style={{ backgroundColor: '#F9F7F2', minHeight: '100vh' }}>

      {/* Top bar */}
      <div style={{ backgroundColor: '#0f0608', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: 'serif', fontSize: 20, color: '#F5F0E8', fontWeight: 700 }}>
          Food<span style={{ color: '#C9A84C' }}>·</span>Mood
        </p>
        <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)' }}>
          Pre-Seed Investment Brief · Confidential · May 2026
        </span>
      </div>

      {/* Pitch Deck CTA block */}
      <div style={{ backgroundColor: '#2d0f16', padding: '36px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 12 }}>
          Pitch Deck · Pre-Seed 2026
        </p>
        <p style={{ fontFamily: 'serif', fontSize: 26, color: '#F5F0E8', fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
          Food·Mood — The Full Picture
        </p>
        <p style={{ fontSize: 14, color: 'rgba(245,240,232,0.55)', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
          Descarga el Pitch Deck completo: modelo de negocio, métricas, roadmap y estructura de la ronda Pre-Seed.
        </p>
        <a
          href="/pitch-deck-pre-seed-2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: '#C9A84C',
            color: '#0f0608',
            fontWeight: 700,
            fontSize: 14,
            padding: '13px 28px',
            borderRadius: 30,
            textDecoration: 'none',
            letterSpacing: '0.03em',
          }}
        >
          📄 Ver / Descargar Pitch Deck (PDF)
        </a>
        <p style={{ marginTop: 12, fontSize: 11, color: 'rgba(245,240,232,0.25)' }}>
          Documento confidencial · No distribuir sin autorización
        </p>
      </div>

      {/* Investment Brief */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '48px 40px 64px', fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, lineHeight: 1.65, color: '#1A1612' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1.5px solid #1A1612', paddingBottom: 12, marginBottom: 28 }}>
          <div style={{ fontFamily: 'serif', fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: '#1A1612', lineHeight: 1 }}>
            Food<span style={{ color: '#3A8C62' }}>·</span>Mood
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.12em', color: '#6B6358', textTransform: 'uppercase', textAlign: 'right', lineHeight: 1.7 }}>
            Pre-Seed Investment Brief<br />
            May 2026 · WomenInvestEU Femtech · Confidential
          </div>
        </div>

        <h1 style={{ fontFamily: 'serif', fontSize: 16, fontWeight: 700, color: '#1A1612', marginBottom: 5 }}>The Ask</h1>
        <p style={{ fontSize: 10.5, color: '#6B6358', marginBottom: 16 }}>
          Raising <strong style={{ color: '#1A1612' }}>€140,000</strong> pre-seed — 18-month runway to 500 paying subscribers.
        </p>

        {/* Two-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 8 }}>
          <div>
            <SectionLabel>What We Do</SectionLabel>
            <p style={bodyP}>Food·Mood is a psychobiotic nutrition platform for <strong style={{ color: '#1A1612' }}>Spanish-speaking women aged 45+</strong> navigating perimenopause, menopause, and midlife transitions — a population of ~95 million across Spain, Latin America, and Hispanic USA with zero personalised nutritional support in their language.</p>
            <p style={bodyP}>The app maps emotional and hormonal state to evidence-based functional nutrition: daily psychobiotic recipes, guided transformation challenges (7–28 days), audio content, and habit tracking — making preventive health engaging and accessible through gamification.</p>
            <p style={bodyP}>90% of serotonin is produced in the gut, yet no existing app integrates gut-brain science into daily nutrition for this demographic. Calorie trackers count macros. Mental health apps offer meditation. Food·Mood connects the dots: what you eat shapes how you feel.</p>
          </div>
          <div>
            <SectionLabel>Market Opportunity</SectionLabel>
            <p style={bodyP}><strong style={{ color: '#1A1612' }}>TAM — ~95M Spanish-speaking women 45+ globally:</strong> Spain (11M) · Latin America (75M) · Hispanic USA (9M). Every major wellness app is English-first or lacks the scientific depth for this life stage. No competitor has established a gut-brain nutrition brand in Spanish.</p>
            <p style={bodyP}><strong style={{ color: '#1A1612' }}>SAM — ~10M paying-capable digital wellness users</strong> within that TAM. Paid app penetration: ~20% in Spain, 8–15% across LATAM, ~25% in US Hispanic market (Sensor Tower, 2024).</p>
            <p style={bodyP}><strong style={{ color: '#1A1612' }}>SOM (18-month):</strong> 2,500 challenge purchases + 500 active subscribers → ~€116K annual revenue run rate. At 1% of the Spanish SAM: 22,000 subscribers = <strong style={{ color: '#1A1612' }}>€2.4M ARR</strong>. The psychobiotics subcategory is a $2.5B emerging segment — Food·Mood is positioned as its first Spanish-language consumer brand.</p>
            <SectionLabel>Why Now</SectionLabel>
            <p style={bodyP}>Smartphone penetration in LATAM crossed 70% in 2024. App spending among women 40+ grew 34% in 2023 (Sensor Tower). Yet every evidence-based gut-brain wellness app is English-only. Psychobiotic research has matured for consumer products, and the EU regulatory environment (GDPR, Digital Health Act) favours privacy-first European platforms. The window to become the category-defining Spanish-language app for women 45+ is open — and uncontested.</p>
          </div>
        </div>

        <SectionLabel>Business Model</SectionLabel>
        <p style={{ fontSize: 9.5, color: '#6B6358', lineHeight: 1.6, marginTop: 4, marginBottom: 10, fontStyle: 'italic' }}>
          Challenge-first acquisition → subscription retention. Two distinct revenue streams that reinforce each other: challenges drive the first payment and completion; subscriptions capture the retained LTV.
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
          {[
            ['1. Transformation Challenges (acquisition engine):', '7–28 day outcome-specific programs at €19–€29. The primary entry point: low barrier, high intent, clear promise (energy / focus / hormonal reset / sleep). Users complete a challenge, experience results, and convert to subscription. Recurring by nature — users return for different challenges as their needs evolve throughout the year.'],
            ['2. Premium Subscription (recurring revenue base):', '€9/month (or €7/month quarterly) for full recipe library, personalised emotional palette, 90-day history, and ongoing challenge access. The MRR engine. Challenge-to-subscription is the core conversion funnel; the 18-month subscriber milestone is the output of that funnel.'],
            ['3. Corporate Wellness (B2B, high-ticket):', 'Group challenges and team tracking for companies — pilot from €490, per-employee from €12/employee. One mid-size corporate contract equals the revenue of 50+ monthly subscribers in a single transaction.'],
          ].map(([label, text]) => (
            <li key={label} style={{ fontSize: 10, color: '#4A4540', lineHeight: 1.55, paddingLeft: 14, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#3A8C62', fontWeight: 700 }}>·</span>
              <strong style={{ color: '#1A1612' }}>{label}</strong>{' '}{text}
            </li>
          ))}
        </ul>

        <SectionLabel>Competitive Landscape</SectionLabel>
        <p style={{ fontSize: 9.5, color: '#6B6358', lineHeight: 1.6, marginTop: 4, marginBottom: 10, fontStyle: 'italic' }}>
          No direct competitor operates at the intersection of Spanish-language, gut-brain science, and women 45+. The market is fragmented between English-first trackers and generic wellness apps.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 6, fontSize: 9.5 }}>
          <thead>
            <tr>
              {['App', 'Language', 'Gut-brain science', 'Women 45+', 'Spanish market', 'Model', '€/mo'].map(h => (
                <th key={h} style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B8B0A4', padding: '0 8px 6px 0', textAlign: 'left', borderBottom: '1px solid #F0EDE4', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Noom',          'EN only',     '✗', '✗', '✗', 'Subscription',  '$60+'],
              ['Lifesum',       'EN / multi',  '✗', '✗', '✗', 'Subscription',  '€4–9'],
              ['MyFitnessPal',  'EN only',     '✗', '✗', '✗', 'Freemium',      '€10+'],
              ['Yazio',         'EN / DE',     '✗', '✗', '✗', 'Subscription',  '€4–8'],
              ['Elektra Health','EN only',     '△', '✓', '✗', 'Subscription',  '$15+'],
            ].map(([app, lang, gut, w45, es, model, price]) => (
              <tr key={app} style={{ borderBottom: '1px solid #F0EDE4' }}>
                <td style={{ padding: '6px 8px 6px 0', color: '#4A4540', fontSize: 9.5 }}>{app}</td>
                <td style={{ padding: '6px 8px 6px 0', color: '#6B6358', fontSize: 9 }}>{lang}</td>
                <td style={{ padding: '6px 8px 6px 0', color: gut === '✗' ? '#C0B8B0' : '#3A8C62', fontSize: 9 }}>{gut}</td>
                <td style={{ padding: '6px 8px 6px 0', color: w45 === '✗' ? '#C0B8B0' : '#3A8C62', fontSize: 9 }}>{w45}</td>
                <td style={{ padding: '6px 8px 6px 0', color: es === '✗' ? '#C0B8B0' : '#3A8C62', fontSize: 9 }}>{es}</td>
                <td style={{ padding: '6px 8px 6px 0', color: '#6B6358', fontSize: 9 }}>{model}</td>
                <td style={{ padding: '6px 0', color: '#6B6358', fontSize: 9, fontFamily: 'monospace' }}>{price}</td>
              </tr>
            ))}
            <tr style={{ background: '#F0EDE4' }}>
              <td style={{ padding: '7px 8px 7px 0', color: '#1A1612', fontWeight: 700, fontSize: 9.5 }}>Food·Mood</td>
              <td style={{ padding: '7px 8px 7px 0', color: '#3A8C62', fontWeight: 700, fontSize: 9 }}>ES global</td>
              <td style={{ padding: '7px 8px 7px 0', color: '#3A8C62', fontWeight: 700, fontSize: 9 }}>✓</td>
              <td style={{ padding: '7px 8px 7px 0', color: '#3A8C62', fontWeight: 700, fontSize: 9 }}>✓</td>
              <td style={{ padding: '7px 8px 7px 0', color: '#3A8C62', fontWeight: 700, fontSize: 9 }}>✓</td>
              <td style={{ padding: '7px 8px 7px 0', color: '#1A1612', fontWeight: 700, fontSize: 9 }}>Challenge + Sub</td>
              <td style={{ padding: '7px 0', color: '#3A8C62', fontWeight: 700, fontSize: 9, fontFamily: 'monospace' }}>€7–9</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: 8.5, color: '#B8B0A4', marginTop: 6, fontStyle: 'italic', lineHeight: 1.5 }}>
          △ Elektra Health addresses symptoms; does not integrate nutritional science. No competitor offers gut-brain nutrition in Spanish for perimenopause/menopause.
        </p>

        <SectionLabel>Use of Funds</SectionLabel>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 6, fontSize: 10 }}>
          <thead>
            <tr>
              {['Category', 'Amount', '%', 'Note'].map(h => (
                <th key={h} style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8B0A4', padding: '0 0 6px', textAlign: 'left', borderBottom: '1px solid #F0EDE4', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Product & Tech', '€50,000', '36%', 'AI coaching, content engine'],
              ['Growth & Marketing', '€35,000', '25%', 'Paid acquisition, PR'],
              ['Scientific Validation', '€20,000', '14%', 'Pilot studies, advisory board'],
              ['Operations & Founder Salary', '€35,000', '25%', '€1,500/mo founder salary'],
            ].map(([cat, amt, pct, note]) => (
              <tr key={cat} style={{ borderBottom: '1px solid #F0EDE4' }}>
                <td style={{ padding: '7px 0', color: '#1A1612', fontSize: 10 }}>{cat}</td>
                <td style={{ padding: '7px 16px 7px 0', fontFamily: 'monospace', fontSize: 9.5, color: '#3A8C62', fontWeight: 500, textAlign: 'right' }}>{amt}</td>
                <td style={{ padding: '7px 16px 7px 0', textAlign: 'right', fontSize: 9.5, color: '#6B6358' }}>{pct}</td>
                <td style={{ fontSize: 9, color: '#B8B0A4', fontStyle: 'italic' }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 8.5, color: '#B8B0A4', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
          Operations includes founder minimum salary of €1,500/month (€27K over 18 months) plus fixed costs. Full compensation to be normalised at Seed stage.
        </p>

        <SectionLabel>Milestones (post-close)</SectionLabel>
        <p style={{ fontSize: 9.5, color: '#6B6358', lineHeight: 1.6, marginTop: 4, marginBottom: 10, fontStyle: 'italic' }}>
          Dates are relative to funding close. Round expected to close H2 2026.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 6 }}>
          {[
            { date: 'Q1 2027', items: ['All 8 challenges live', '200 active subscribers', 'Book publication', 'Corporate Wellness pipeline active — first proposals sent'] },
            { date: 'Q3 2027', items: ['2,500 challenge purchases (acquisition)', '500 active subscribers (retained base)', 'First Corporate Wellness pilot closed', '€8K–12K MRR equivalent', 'AI coaching module launch'] },
            { date: 'Q1 2028', items: ['LATAM + US Hispanic expansion', 'Seed round', '€25K+ MRR · 1,500+ active subscribers', '2–3 Corporate Wellness clients'] },
          ].map(({ date, items }) => (
            <div key={date} style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 16, padding: '9px 0', borderBottom: '1px solid #F0EDE4', alignItems: 'start' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#3A8C62', letterSpacing: '0.06em', fontWeight: 500, paddingTop: 1 }}>{date}</div>
              <div style={{ fontSize: 10, color: '#1A1612', lineHeight: 1.55 }}>
                {items.join(' · ')}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 8.5, color: '#B8B0A4', marginTop: 10, fontStyle: 'italic', lineHeight: 1.6, borderLeft: '2px solid #E0EDE6', paddingLeft: 10 }}>
          Series A horizon (not factored into this round): at 10,000+ active users, GDPR-compliant aggregated behavioural data — correlating food, mood, hormonal phase, and habit — becomes a licensable asset for public health research and nutraceutical innovation. The dataset Food·Mood is building has no equivalent in Spanish-language women&apos;s health.
        </p>

        <SectionLabel>The Founder</SectionLabel>
        <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 8, padding: '20px 24px', marginTop: 8 }}>
          <div style={{ fontFamily: 'serif', fontSize: 13, fontWeight: 700, color: '#1A1612', marginBottom: 3 }}>Susana Ferreras Diez</div>
          <div style={{ fontFamily: 'monospace', fontSize: 7.5, letterSpacing: '0.1em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 10 }}>CEO &amp; Founder</div>
          <p style={{ fontSize: 10, color: '#4A4540', lineHeight: 1.65 }}>
            Psychologist · MSc Food Biotechnology · MSc Gerontology · Creator of a kombucha brand and gut-health practitioner. Full-stack developer who built the entire Food·Mood MVP herself: Next.js, Supabase, Stripe, Vercel. Author of <em>&quot;Food·Mood: El placer de estar bien&quot;</em> (2026, pre-publication).
          </p>
          <p style={{ fontFamily: 'serif', fontSize: 10.5, fontStyle: 'italic', color: '#6B6358', marginTop: 10, lineHeight: 1.55, borderLeft: '2px solid #3A8C62', paddingLeft: 12 }}>
            &quot;This is not a founder who hired a team to build her vision. This is a founder who is the product — the science, the code, the content, and the community.&quot;
          </p>
        </div>

        <SectionLabel>Current Status</SectionLabel>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
          {[
            'Functional PWA live at food-mood.app with payment infrastructure ready',
            'Active newsletter + WhatsApp & Telegram community channels',
            'Book written (pre-publication); audio content in production',
            '3 transformation challenges built; 5 more in development pipeline',
            "Concept validated via founder's expert coaching practice and Umyko wellness community",
            'First investor matchmaking: WomenInvestEU Femtech — June 2026',
          ].map(item => (
            <li key={item} style={{ fontSize: 10, color: '#4A4540', lineHeight: 1.5, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3A8C62', flexShrink: 0, marginTop: 5, display: 'inline-block' }} />
              {item}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 28, paddingTop: 12, borderTop: '1px solid #E0EDE6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: '#3A8C62', letterSpacing: '0.08em', lineHeight: 1.7 }}>
            Susana Ferreras Diez · CEO &amp; Founder<br />
            www.food-mood.app
          </div>
          <div style={{ fontSize: 7, color: '#B8B0A4', textAlign: 'right', maxWidth: 340, lineHeight: 1.5 }}>
            This document is confidential and intended solely for the recipient. All projections are forward-looking estimates and not guarantees of future performance.
          </div>
        </div>
      </div>
    </main>
  )
}

const bodyP: React.CSSProperties = { fontSize: 10, color: '#4A4540', lineHeight: 1.68, marginTop: 8 }

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'monospace',
      fontSize: 7,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#3A8C62',
      marginTop: 22,
      marginBottom: 10,
      paddingBottom: 4,
      borderBottom: '1px solid #E0EDE6',
    }}>
      {children}
    </div>
  )
}

export default async function InversoresPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const cookieStore = await cookies()
  const auth = cookieStore.get(COOKIE)?.value === 'true'

  const params = await searchParams
  const wrong  = params.error === '1'

  if (!auth) return <Gate wrong={wrong} />
  return <InvestorDeck />
}
