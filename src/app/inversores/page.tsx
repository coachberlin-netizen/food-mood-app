import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Investors · Food·Mood Pre-Seed 2026',
  description: 'Confidential information for investors. Restricted access.',
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
            Pre-Seed · Investor Access
          </p>
          <p style={{ fontSize: 14, color: 'rgba(245,240,232,0.5)', lineHeight: 1.6 }}>
            This area is confidential. Enter the access key you received.
          </p>
        </div>

        <form action={verifyPassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            name="password"
            type="password"
            placeholder="Access key"
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
              Incorrect key. Please verify and try again.
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
            Access →
          </button>
        </form>

        <p style={{ marginTop: 32, fontSize: 13, color: 'rgba(245,240,232,0.5)' }}>
          ¿Sin acceso?{' '}
          <a
            href="mailto:info@food-mood.app?subject=Food·Mood — Solicitud de acceso investor deck"
            style={{ color: '#C9A84C', textDecoration: 'none', fontWeight: 600 }}
          >
            info@food-mood.app
          </a>
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
        <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A84C' }}>
          Pre-Seed Investment Brief · Confidential · 2026
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
        <p style={{ fontSize: 14, color: 'rgba(245,240,232,0.85)', marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
          Download the full Pitch Deck: business model, metrics, roadmap and Pre-Seed round structure.
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
          📄 View / Download Pitch Deck (PDF)
        </a>
        <p style={{ marginTop: 12, fontSize: 11, color: 'rgba(245,240,232,0.55)' }}>
          Confidential document · Do not distribute without authorisation
        </p>
      </div>

      {/* Investment Brief */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '48px 40px 64px', fontFamily: "'DM Sans', sans-serif", fontSize: 10.5, lineHeight: 1.65, color: '#1A1612' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1.5px solid #1A1612', paddingBottom: 12, marginBottom: 28 }}>
          <div style={{ fontFamily: 'serif', fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: '#1A1612', lineHeight: 1 }}>
            Food<span style={{ color: '#3A8C62' }}>·</span>Mood
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.12em', color: '#3D3028', textTransform: 'uppercase', textAlign: 'right', lineHeight: 1.7 }}>
            Pre-Seed Investment Brief<br />
            May 2026 · Confidential
          </div>
        </div>

        <h1 style={{ fontFamily: 'serif', fontSize: 16, fontWeight: 700, color: '#1A1612', marginBottom: 5 }}>The Ask</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 10.5, color: '#3D3028', lineHeight: 1.65 }}>
              Raising <strong style={{ color: '#1A1612' }}>€140,000</strong> on a <strong style={{ color: '#1A1612' }}>SAFE-style convertible</strong> — <strong style={{ color: '#1A1612' }}>€800K valuation cap</strong>, <strong style={{ color: '#1A1612' }}>20% discount</strong>, ~17.5% implied dilution. Standard European pre-seed terms via a SAFE-style post-money convertible instrument, subject to Spanish/EU legal structuring. The instrument avoids a full priced equity round today while giving early investors clear upside through the cap and discount when it converts at Seed.
            </p>
            <p style={{ fontSize: 10, color: '#3D3028', lineHeight: 1.65, marginTop: 8 }}>
              Valuation is driven by founder profile, product readiness, and market potential — not revenue metrics. At an €800K cap with a 20% discount, this is an attractive early entry point into a category with no established Spanish-language competitor.
            </p>
          </div>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 16px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3A8C62', marginBottom: 8 }}>Round structure</p>
            {[
              ['Instrument', 'SAFE-style convertible'],
              ['Raise', '€140,000'],
              ['Valuation cap', '€800,000'],
              ['Discount', '20% at Seed'],
              ['Implied dilution', '~17.5%'],
              ['Legal structure', 'Subject to counsel'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F0EDE4', padding: '5px 0', fontSize: 9 }}>
                <span style={{ color: '#4A3E38' }}>{k}</span>
                <span style={{ color: '#1A1612', fontWeight: 600, fontFamily: 'monospace' }}>{v}</span>
              </div>
            ))}
            <p style={{ fontSize: 8, color: '#5A4E48', marginTop: 10, fontStyle: 'italic', lineHeight: 1.5 }}>
              The risk is not &quot;can we build this&quot; — the product is already built. It is &quot;can we launch and scale it the right way.&quot; That is exactly what this round funds.
            </p>
          </div>
        </div>

        {/* Two-col */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 8 }}>
          <div>
            <SectionLabel>What We Do</SectionLabel>
            <p style={bodyP}>Food·Mood is a <strong style={{ color: '#1A1612' }}>habit formation engine</strong> that uses the sensory pleasure of functional food as the behavioral anchor — for the <strong style={{ color: '#1A1612' }}>95M+ Spanish-speaking adults</strong> across Spain, Latin America, and Hispanic USA who lack personalised nutritional support in their language.</p>
            <p style={bodyP}>The core insight: lasting habits form when anchored to pleasure, not willpower. The mechanism is biological — 90% of serotonin is produced in the gut. When you eat the right food for your emotional state and enjoy it, you activate the reward circuit that makes you want to repeat it. That is how sustainable habits are built: not through discipline, but through sensory experience.</p>
            <p style={bodyP}>The product: expert-curated psychobiotic recipes mapped to emotional state, guided transformation challenges (7–28 days), daily habit tracking, and a proprietary Food·Mood Index that shows each user how their food choices correlate with their mood, energy, and focus over time. No calorie counting. No guilt. No willpower required.</p>
          </div>
          <div>
            <SectionLabel>Market Opportunity</SectionLabel>
            <p style={bodyP}><strong style={{ color: '#1A1612' }}>TAM — ~95M Spanish-speaking women 45+ globally:</strong> Spain (11M) · Latin America (75M) · Hispanic USA (9M). Every major wellness app is English-first or lacks the scientific depth for this life stage. No competitor has established a gut-brain nutrition brand in Spanish.</p>
            <p style={bodyP}><strong style={{ color: '#1A1612' }}>SAM — ~10M paying-capable digital wellness users</strong> within that TAM. Paid app penetration: ~20% in Spain, 8–15% across LATAM, ~25% in US Hispanic market (Sensor Tower, 2024).</p>
            <p style={bodyP}><strong style={{ color: '#1A1612' }}>SOM (18-month):</strong> 2,500 challenge purchases + 500 active subscribers → ~€116K annual revenue run rate. At 1% of the Spanish SAM: 22,000 subscribers = <strong style={{ color: '#1A1612' }}>€2.4M ARR</strong>. The psychobiotics subcategory is a $2.5B emerging segment — Food·Mood is positioned as its first Spanish-language consumer brand.</p>
            <SectionLabel>Why Now</SectionLabel>
            <p style={bodyP}>Smartphone penetration in LATAM crossed 70% in 2024. App spending among women 40+ grew 34% in 2023 (Sensor Tower). Yet every evidence-based gut-brain wellness app is English-only. Psychobiotic research has matured for consumer products, and the EU regulatory environment (GDPR, EU AI Act, and the European Health Data Space framework) favours privacy-first European platforms. The window to become the category-defining Spanish-language app for women 45+ is open — and uncontested.</p>
          </div>
        </div>

        <SectionLabel>Business Model</SectionLabel>
        <p style={{ fontSize: 9.5, color: '#3D3028', lineHeight: 1.6, marginTop: 4, marginBottom: 10, fontStyle: 'italic' }}>
          Challenge-first acquisition → subscription retention. Three distinct revenue streams that reinforce each other: challenges drive the first payment and completion; subscriptions capture the retained LTV; corporate contracts compress revenue per transaction.
        </p>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
          {[
            ['1. Transformation Challenges (acquisition engine):', '7–28 day outcome-specific programs at €19–€29. The primary entry point: low barrier, high intent, clear promise (energy / focus / hormonal reset / sleep). Users complete a challenge, experience results, and convert to subscription. Recurring by nature — users return for different challenges as their needs evolve throughout the year.'],
            ['2. Premium Subscription (recurring revenue base):', '€9/month (or €7/month quarterly) for full recipe library, personalised emotional palette, 90-day history, and ongoing challenge access. The MRR engine. Challenge-to-subscription is the core conversion funnel; the 18-month subscriber milestone is the output of that funnel.'],
            ['3. Corporate Wellness (B2B, high-ticket):', 'Group challenges and team tracking for companies — pilot from €490, per-employee from €12/employee. One mid-size corporate contract equals the revenue of 50+ monthly subscribers in a single transaction.'],
          ].map(([label, text]) => (
            <li key={label} style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.55, paddingLeft: 14, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#3A8C62', fontWeight: 700 }}>·</span>
              <strong style={{ color: '#1A1612' }}>{label}</strong>{' '}{text}
            </li>
          ))}
        </ul>

        <SectionLabel>Competitive Landscape</SectionLabel>
        <p style={{ fontSize: 9.5, color: '#3D3028', lineHeight: 1.6, marginTop: 4, marginBottom: 10, fontStyle: 'italic' }}>
          No direct competitor operates at the intersection of Spanish-language, gut-brain science, and women 45+. The market is fragmented between English-first trackers and generic wellness apps.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 6, fontSize: 9.5 }}>
          <thead>
            <tr>
              {['App', 'Spanish-first', 'Gut-brain focus', 'Women 45+ focus', 'Habit formation', 'Model', '€/mo'].map(h => (
                <th key={h} style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A4E48', padding: '0 8px 6px 0', textAlign: 'left', borderBottom: '1px solid #F0EDE4', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Noom',          '✗', '✗', '✗', '△', 'Subscription',  '$60+'],
              ['Lifesum',       '△', '✗', '✗', '✗', 'Subscription',  '€4–9'],
              ['MyFitnessPal',  '△', '✗', '✗', '✗', 'Freemium',      '€10+'],
              ['Yazio',         '△', '✗', '✗', '✗', 'Subscription',  '€4–8'],
              ['Elektra Health','✗', '△', '✓', '✗', 'Subscription',  '$15+'],
            ].map(([app, es, gut, w45, habit, model, price]) => (
              <tr key={app} style={{ borderBottom: '1px solid #F0EDE4' }}>
                <td style={{ padding: '6px 8px 6px 0', color: '#2A2218', fontSize: 9.5 }}>{app}</td>
                <td style={{ padding: '6px 8px 6px 0', color: es === '✗' ? '#C0B8B0' : es === '△' ? '#C9A84C' : '#3A8C62', fontSize: 9 }}>{es}</td>
                <td style={{ padding: '6px 8px 6px 0', color: gut === '✗' ? '#C0B8B0' : gut === '△' ? '#C9A84C' : '#3A8C62', fontSize: 9 }}>{gut}</td>
                <td style={{ padding: '6px 8px 6px 0', color: w45 === '✗' ? '#C0B8B0' : w45 === '△' ? '#C9A84C' : '#3A8C62', fontSize: 9 }}>{w45}</td>
                <td style={{ padding: '6px 8px 6px 0', color: habit === '✗' ? '#C0B8B0' : habit === '△' ? '#C9A84C' : '#3A8C62', fontSize: 9 }}>{habit}</td>
                <td style={{ padding: '6px 8px 6px 0', color: '#3D3028', fontSize: 9 }}>{model}</td>
                <td style={{ padding: '6px 0', color: '#3D3028', fontSize: 9, fontFamily: 'monospace' }}>{price}</td>
              </tr>
            ))}
            <tr style={{ background: '#F0EDE4' }}>
              <td style={{ padding: '7px 8px 7px 0', color: '#1A1612', fontWeight: 700, fontSize: 9.5 }}>Food·Mood</td>
              <td style={{ padding: '7px 8px 7px 0', color: '#3A8C62', fontWeight: 700, fontSize: 9 }}>✓</td>
              <td style={{ padding: '7px 8px 7px 0', color: '#3A8C62', fontWeight: 700, fontSize: 9 }}>✓</td>
              <td style={{ padding: '7px 8px 7px 0', color: '#3A8C62', fontWeight: 700, fontSize: 9 }}>✓</td>
              <td style={{ padding: '7px 8px 7px 0', color: '#3A8C62', fontWeight: 700, fontSize: 9 }}>✓</td>
              <td style={{ padding: '7px 8px 7px 0', color: '#1A1612', fontWeight: 700, fontSize: 9 }}>Challenge + Sub</td>
              <td style={{ padding: '7px 0', color: '#3A8C62', fontWeight: 700, fontSize: 9, fontFamily: 'monospace' }}>€7–9</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: 8.5, color: '#5A4E48', marginTop: 6, fontStyle: 'italic', lineHeight: 1.5 }}>
          △ Elektra Health addresses symptoms; does not integrate nutritional science. No competitor offers gut-brain nutrition in Spanish for perimenopause/menopause. Food·Mood is the first.
        </p>

        {/* Noom deep-dive */}
        <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4E48', marginTop: 18, marginBottom: 8 }}>Noom: Proof of Category — and the Gap They Left</p>
        <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginBottom: 10 }}>
          <strong style={{ color: '#1A1612' }}>Noom raised over $650M and reached a reported $3.7B valuation</strong> by combining psychology, nutrition, and technology. They proved the category. They also proved where the model stops — and the map of what they never built.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10, fontSize: 9.5 }}>
          <thead>
            <tr>
              {['Dimension', 'Noom', 'Food·Mood'].map((h, i) => (
                <th key={h} style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: i === 2 ? '#3A8C62' : '#5A4E48', padding: '0 10px 6px 0', textAlign: 'left', borderBottom: '1px solid #F0EDE4', fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['Language', 'English-first', 'Native Spanish, globally — 95M women 45+'],
              ['Focus', 'Weight-loss centric', 'Emotional wellbeing — no scales, no calories, no guilt'],
              ['Price', '$17–70 / month', '€7–9 / month — accessible across all Spanish markets'],
              ['Coaching', '3,000+ human coaches (high fixed cost)', 'AI coaching — scalable from day one'],
              ['Science', 'Behavioural psychology (CBT)', 'Gut-brain neuroscience + psychobiotics — the next frontier'],
              ['Core', 'Generic meal tracking', 'Psychobiotic recipes mapped to mood + Food·Mood Index'],
            ].map(([dim, noom, fm]) => (
              <tr key={dim} style={{ borderBottom: '1px solid #F0EDE4' }}>
                <td style={{ padding: '6px 10px 6px 0', color: '#5A4E48', fontSize: 8, fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{dim}</td>
                <td style={{ padding: '6px 10px 6px 0', color: '#3D3028', fontSize: 9, lineHeight: 1.5 }}>{noom}</td>
                <td style={{ padding: '6px 0', color: '#1A1612', fontSize: 9, lineHeight: 1.5, fontWeight: 500 }}>{fm}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* GLP-1 callout */}
        <div style={{ background: '#FFF8EE', border: '1px solid #E8D9B0', borderRadius: 5, padding: '10px 14px', marginBottom: 12 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: 5 }}>Market shift · GLP-1 agonists (Ozempic, Wegovy)</p>
          <p style={{ fontSize: 9.5, color: '#2A2218', lineHeight: 1.65 }}>
            GLP-1 agonists (Ozempic, Wegovy) producing 15–20% body weight reduction are reshaping behavioral weight-management. Incumbents are pivoting toward GLP-1 companion programs; the legacy calorie / behavior-tracking model is under structural pressure. <strong style={{ color: '#1A1612' }}>Food·Mood operates in a different lane</strong> — emotional wellbeing, menopausal wellbeing and gut-brain habit formation are complementary to, not replaceable by, a prescription.
          </p>
        </div>

        <p style={{ fontSize: 9.5, color: '#2A2218', lineHeight: 1.65, marginBottom: 4, fontStyle: 'italic' }}>
          Noom built a $3.7B company serving English-speaking women who want to lose weight.<br />
          <strong style={{ color: '#1A1612' }}>Food·Mood is building the first company for Spanish-speaking women 45+ who want to feel better.</strong>
        </p>
        <p style={{ fontSize: 9, color: '#5A4E48', lineHeight: 1.6, fontStyle: 'italic' }}>
          At an €800K cap, this is not a bet against a giant. It is a bet on the beach they left empty.
        </p>

        {/* Psychological framework — collapsible */}
        <details style={{ marginTop: 16, marginBottom: 4 }}>
          <summary style={{ fontFamily: 'monospace', fontSize: 7.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3A8C62', padding: '10px 14px', background: '#F0EDE4', borderRadius: 4, cursor: 'pointer', border: '1px solid #E0EDE6', userSelect: 'none' }}>
            Scientific &amp; Psychological Foundation — 6 Theoretical Pillars · Click to expand
          </summary>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderTop: 'none', borderRadius: '0 0 4px 4px', padding: '18px 20px' }}>
            <p style={{ fontSize: 9.5, color: '#3D3028', lineHeight: 1.65, marginBottom: 14, fontStyle: 'italic' }}>
              Food·Mood is not built on a single theory. It is an interdisciplinary ecosystem where six established frameworks converge — each one mapping directly to a feature of the product.
            </p>

            {/* Umbrella naming */}
            <div style={{ background: '#F0EDE4', border: '1px solid #E0EDE6', borderLeft: '3px solid #3A8C62', borderRadius: '0 4px 4px 0', padding: '14px 16px', marginBottom: 18 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3A8C62', marginBottom: 8 }}>How We Name the Framework</p>
              <p style={{ fontSize: 10, color: '#1A1612', lineHeight: 1.65, marginBottom: 8 }}>
                The umbrella concept that integrates all six theories is <strong>Affective Embodied Psychology</strong> — or, for academic contexts, <strong>Neuropsychology of Nutritional Wellbeing</strong>. Food·Mood&apos;s approach sits at the intersection of three established fields:
              </p>
              {[
                ['Positive Psychology (Seligman)', 'wellbeing, flourishing, and strengths-based interventions'],
                ['Affective Neuroscience (Panksepp)', 'the biological architecture of emotion; bottom-up feeling states that originate in the body, not the cortex'],
                ['Behavioural Health Psychology', 'habit formation, conditioned responses, and behaviour change at scale'],
              ].map(([field, desc]) => (
                <div key={field} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: '#3A8C62', fontWeight: 700, flexShrink: 0, fontSize: 10 }}>·</span>
                  <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.55, margin: 0 }}><strong style={{ color: '#1A1612' }}>{field}</strong> — {desc}</p>
                </div>
              ))}
              <p style={{ fontFamily: 'serif', fontSize: 11, fontStyle: 'italic', color: '#3D3028', marginTop: 12, lineHeight: 1.6, borderTop: '1px solid #E0EDE6', paddingTop: 10 }}>
                &quot;The science of how your body builds your emotions — and how food can influence the body signals that shape mood, energy and emotional regulation.&quot;
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: 7.5, color: '#5A4E48', marginTop: 4, letterSpacing: '0.06em' }}>Consumer-facing summary · used in app, book, and marketing</p>
            </div>

            {/* Module → theory mapping table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 18, fontSize: 9 }}>
              <thead>
                <tr>
                  {['App Module', 'Theory', 'Key Author'].map(h => (
                    <th key={h} style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A4E48', padding: '0 10px 6px 0', textAlign: 'left', borderBottom: '1px solid #E0EDE6', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Emotional palette + granularity', 'Theory of Constructed Emotion', 'Lisa Feldman Barrett'],
                  ['Emotional triads', 'Evolutionary Theory of Emotions', 'Robert Plutchik'],
                  ['Food → mood response', 'Somatic Marker Hypothesis', 'Antonio Damasio'],
                  ['Sensory stress modulation', 'Two-Factor Theory of Emotion', 'Schachter &amp; Singer'],
                  ['Food habit formation', 'Behaviourism / Conditioning', 'Pavlov · Skinner · Mowrer'],
                  ['Gut-brain axis', 'Extended Embodied Cognition', 'Varela · Damasio · current research'],
                ].map(([mod, theory, author]) => (
                  <tr key={mod} style={{ borderBottom: '1px solid #F0EDE4' }}>
                    <td style={{ padding: '6px 10px 6px 0', color: '#1A1612', fontSize: 9, fontWeight: 500 }} dangerouslySetInnerHTML={{ __html: mod }} />
                    <td style={{ padding: '6px 10px 6px 0', color: '#3A8C62', fontSize: 9 }} dangerouslySetInnerHTML={{ __html: theory }} />
                    <td style={{ padding: '6px 0', color: '#5A4E48', fontSize: 9, fontFamily: 'monospace' }} dangerouslySetInnerHTML={{ __html: author }} />
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Theory summaries */}
            <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5A4E48', marginBottom: 10 }}>Macro frame — Embodied Cognition</p>
            <p style={{ fontSize: 9.5, color: '#2A2218', lineHeight: 1.65, marginBottom: 14 }}>The mind does not exist in isolation from the body. Gut states, posture, and the senses co-construct cognitive and emotional experience. Eating is not just nutrition — it is an act of embodied emotional regulation. The &quot;gut feeling&quot; literally acts as a background modulator for all decision-making. This is the scientific legitimacy for everything Food·Mood does.</p>

            {[
              ['Theory of Constructed Emotion (Barrett)', 'Emotions are not universal and fixed. The brain constructs them predictively in the moment, using learned concepts and prior experience. Emotional granularity — the ability to differentiate emotions precisely — directly improves wellbeing and stress management. Training users to name specific emotional states (the Food·Mood palette) is a therapeutically validated intervention.'],
              ['Somatic Marker Hypothesis (Damasio)', 'Somatic markers are bodily signals — tension, nausea, warmth, fullness — that the brain associates with past situations and outcomes, guiding future decisions consciously and non-consciously. This gives scientific grounding to the core claim: certain foods generate learned emotional responses that influence behaviour.'],
              ['Two-Factor Theory (Schachter & Singer)', 'Emotion results from two factors: physiological arousal + the cognitive label the person assigns to that arousal. Applied to Food·Mood: stress generates physical arousal that users can learn to re-label through the sensory experience of eating, modulating the resulting emotional state.'],
              ['Behaviourism & Conditioning (Pavlov · Skinner · Mowrer)', 'Habits form through stimulus-response-reward associations. Food·Mood creates new pleasurable conditionings between specific foods and positive emotional states. Mowrer\'s two-factor theory explains habit persistence — why the challenge model works: completion generates emotional reward that drives return behaviour.'],
              ['Plutchik\'s Wheel of Emotions', '8 basic emotions organised by similarity, polarity, and intensity. Complex emotions are combinations of the basics — giving logical structure to the emotional palette and triads. This positions Food·Mood within the Evolutionary Psychology of Emotions, a well-established academic tradition.'],
              ['Applied Sensory Neuroscience', 'Within 3 seconds of tasting a food, the brain reaches peak emotional activation. The interplay between the amygdala (emotions) and the gustatory cortex explains why the same food &quot;tastes different&quot; depending on prior emotional state — and vice versa. This validates the bidirectionality of the food-mood model.'],
            ].map(([title, text]) => (
              <div key={title} style={{ marginBottom: 12, paddingLeft: 10, borderLeft: '2px solid #E0EDE6' }}>
                <p style={{ fontSize: 9.5, color: '#1A1612', fontWeight: 600, marginBottom: 3 }}>{title}</p>
                <p style={{ fontSize: 9.5, color: '#2A2218', lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: text }} />
              </div>
            ))}
          </div>
        </details>

        <SectionLabel>Use of Funds</SectionLabel>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 6, fontSize: 10 }}>
          <thead>
            <tr>
              {['Category', 'Amount', '%', 'Note'].map(h => (
                <th key={h} style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5A4E48', padding: '0 0 6px', textAlign: 'left', borderBottom: '1px solid #F0EDE4', fontWeight: 400 }}>{h}</th>
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
                <td style={{ padding: '7px 16px 7px 0', textAlign: 'right', fontSize: 9.5, color: '#3D3028' }}>{pct}</td>
                <td style={{ fontSize: 9, color: '#5A4E48', fontStyle: 'italic' }}>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 8.5, color: '#5A4E48', marginTop: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
          Operations includes founder minimum salary of €1,500/month (€27K over 18 months) plus fixed costs. Full compensation to be normalised at Seed stage.
        </p>

        <SectionLabel>Milestones (post-close)</SectionLabel>
        <p style={{ fontSize: 9.5, color: '#3D3028', lineHeight: 1.6, marginTop: 4, marginBottom: 10, fontStyle: 'italic' }}>
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

        <p style={{ fontSize: 8.5, color: '#5A4E48', marginTop: 10, fontStyle: 'italic', lineHeight: 1.6, borderLeft: '2px solid #E0EDE6', paddingLeft: 10 }}>
          Series A horizon (not factored into this round): at 10,000+ active users, GDPR-compliant aggregated behavioural data — correlating food, mood, hormonal phase, and habit — becomes a licensable asset for public health research and nutraceutical innovation. The dataset Food·Mood is building has no equivalent in Spanish-language women&apos;s health.
        </p>

        <SectionLabel>The Founder</SectionLabel>
        <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 8, padding: '20px 24px', marginTop: 8 }}>
          <div style={{ fontFamily: 'serif', fontSize: 13, fontWeight: 700, color: '#1A1612', marginBottom: 3 }}>Susana Ferreras Diez</div>
          <div style={{ fontFamily: 'monospace', fontSize: 7.5, letterSpacing: '0.1em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 10 }}>CEO &amp; Founder</div>
          <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65 }}>
            Psychologist · MSc Food Biotechnology · MSc Gerontology · Creator of a kombucha brand and gut-health practitioner. Full-stack developer who built the entire Food·Mood MVP herself: Next.js, Supabase, Stripe, Vercel. Author of <em>&quot;Food·Mood: El placer de estar bien&quot;</em> (2026, pre-publication).
          </p>
          <p style={{ fontFamily: 'serif', fontSize: 10.5, fontStyle: 'italic', color: '#3D3028', marginTop: 10, lineHeight: 1.55, borderLeft: '2px solid #3A8C62', paddingLeft: 12 }}>
            &quot;This is not a founder who hired a team to build her vision. This is a founder who is the product — the science, the code, the content, and the community.&quot;
          </p>
        </div>

        <SectionLabel>Current Status</SectionLabel>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
          {[
            'MVP fully built and live at food-mood.app — payments integrated, content stack ready, infrastructure tested',
            'AI Digital Advisor live: clinical safety pipeline (crisis detection, TCA signals, drug-food interactions, allergen blocking) validated by founder as mental health professional — no competitor has equivalent',
            'Intentionally pre-launch on users: scaling starts after close, to do it right — not to chase messy early traction',
            'Active newsletter + WhatsApp & Telegram community channels — warm audience ready to onboard',
            'Book written (pre-publication 2026); 7-episode proprietary audio library complete',
            '3 transformation challenges live; 5 more in pipeline — all 8 ready by Q1 2027',
            'Demand validated through founder coaching practice and Umyko wellness community (paying clients)',
            'First investor matchmaking event — June 2026',
          ].map(item => (
            <li key={item} style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.5, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3A8C62', flexShrink: 0, marginTop: 5, display: 'inline-block' }} />
              {item}
            </li>
          ))}
        </ul>

        <SectionLabel>Due Diligence Q&amp;A</SectionLabel>

        {/* Founder & Terms */}
        <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4E48', marginTop: 14, marginBottom: 8 }}>Founder &amp; Terms</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — Is the founder fully committed? The €1,500/month salary suggests other income sources.</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65 }}>The €1,500/month salary for the first 18 months is the minimum viable amount to maintain exclusive focus on Food·Mood without burning personal reserves. This reflects capital discipline — 87% of the round goes directly to product, growth, and validation — not lack of commitment. Unlike founders who pay themselves €4–5K/month at pre-seed and burn runway in 12 months, this structure maximises runway length. Full market-rate compensation will normalise at Seed stage.</p>
          </div>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — Is this a solo-founder risk?</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65 }}>No. I have a co-founder / partner handling administration, operations, and compliance. My role covers product, science, technology, and content; theirs covers the operational infrastructure that allows me to build. This division mitigates &quot;bus factor&quot; risk — the company does not depend on a single person to function.</p>
          </div>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — What is the founder&apos;s prior financial track record? Was the kombucha brand profitable?</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65 }}>The kombucha brand made strong progress. We sold the recipes and operations to pivot to digital — a deliberate strategic exit, not a failure shutdown. The project is currently on standby while I focus on securing resources. I remain a food tech consultant specialising in kombucha (recipes, operations, admin, scaling, and food safety), which provides supplementary income that enables the minimum salary at Food·Mood without distracting from the core focus. This background is an asset: it demonstrates the ability to build food/wellness businesses with solid progress, execute strategic exits, and maintain industry relationships that can open doors for the B2B Corporate Wellness channel.</p>
          </div>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — Why is the valuation cap set at €800K?</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65 }}>Lowering the cap to €800,000 is a deliberate strategic choice, not a sign of weakness. In the European pre-seed market (2025–2026), deals with an MVP but no user traction typically close between €600K–€1.0M. At €800K with a 20% discount, we are offering early investors an attractive entry point into a category with no established competitor, clear upside at Seed conversion (€800K effective pre-money vs. a potential Seed valuation of €3–5M), and aligned incentives: I prefer higher dilution now and a committed investor table, rather than an inflated cap that delays closing or creates down-round tension later.</p>
          </div>
        </div>

        {/* Traction & Validation */}
        <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4E48', marginBottom: 8 }}>Traction &amp; Validation</p>
        <div style={{ marginBottom: 18 }}>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — Why don&apos;t you have users yet? &quot;Intentional pre-launch&quot; sounds like an excuse for having no traction.</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65 }}>The MVP is built, technically tested, and payments-integrated. The decision not to open to mass users yet is deliberate: I prefer to launch with the round closed so I can execute growth with dedicated budget (€35K), validated scientific content (€20K), and capacity to respond to feedback quickly. Launching &quot;just to launch&quot; with limited resources generates messy traction that does not convert.</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 8 }}>What does exist: an active community across newsletter, WhatsApp, and Telegram; demand validated through the founder coaching practice and Umyko wellness community (paying clients); and 3 challenges built with closed beta tester feedback. We are not starting from zero — we are starting from qualitative validation, not product metrics yet.</p>
            <p style={{ fontSize: 10, color: '#1A1612', lineHeight: 1.65, marginTop: 8, fontWeight: 600 }}>Post-close metrics (90 days): 100 paying users · D7 retention &gt;40% · NPS &gt;50.</p>
          </div>
        </div>

        {/* Market & Target Segment */}
        <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4E48', marginBottom: 8 }}>Market &amp; Target Segment</p>
        <div style={{ marginBottom: 18 }}>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — Why such a specific niche? Isn&apos;t women 45+ too small?</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginBottom: 8 }}>It is not small — it is huge and underserved. ~95M Spanish-speaking women 45+ globally, with zero personalised nutritional support in their language. This segment has:</p>
            {[
              'High relative purchasing power (independent children, paid-off homes, available time)',
              'High health payment motivation (perimenopause, menopause, longevity)',
              'Low digital competition — no Spanish-language wellness app addresses the gut-brain axis for this life stage',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#3A8C62', fontWeight: 700, flexShrink: 0, fontSize: 10 }}>·</span>
                <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.55, margin: 0 }}>{item}</p>
              </div>
            ))}
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 10, fontStyle: 'italic' }}>This is not a narrow niche. It is an empty beach where we will be the first footprint.</p>
          </div>
        </div>

        {/* Competition & Moat */}
        <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4E48', marginBottom: 8 }}>Competition &amp; Moat</p>
        <div style={{ marginBottom: 18 }}>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — What prevents Noom or Lifesum from copying this tomorrow?</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginBottom: 10 }}>Three barriers:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ paddingLeft: 12, borderLeft: '2px solid #E0EDE6' }}>
                <p style={{ fontSize: 10, color: '#1A1612', fontWeight: 600, margin: 0 }}>1. Spanish-language scientific content</p>
                <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 3 }}>Replicable, but requires 18–24 months of curation. We already have 3 challenges, 7 audio library episodes, and a book in pre-publication.</p>
              </div>
              <div style={{ paddingLeft: 12, borderLeft: '2px solid #E0EDE6' }}>
                <p style={{ fontSize: 10, color: '#1A1612', fontWeight: 600, margin: 0 }}>2. The founder as product</p>
                <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 3 }}>Noom cannot copy a psychologist + food biotechnologist + gerontologist + full-stack developer who lives this message. Authenticity does not scale easily.</p>
              </div>
              <div style={{ paddingLeft: 12, borderLeft: '2px solid #E0EDE6' }}>
                <p style={{ fontSize: 10, color: '#1A1612', fontWeight: 600, margin: 0 }}>3. The Food·Mood Dataset</p>
                <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 3 }}>At 10,000+ users, our correlated food, mood, hormonal phase, and habit data (GDPR-compliant, aggregated) becomes a licensable asset for public health research and nutraceutical innovation. This dataset has no equivalent in Spanish-language women&apos;s health. Barrier #3 is what transforms us from an app into a data platform — it is not on any competitor&apos;s current roadmap.</p>
              </div>
              <div style={{ paddingLeft: 12, borderLeft: '2px solid #3A8C62' }}>
                <p style={{ fontSize: 10, color: '#1A1612', fontWeight: 600, margin: 0 }}>4. Regulation as a moat, not a risk</p>
                <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 3 }}>Food·Mood uses standard LLM infrastructure (Anthropic Claude) paired with a founder-designed safety filter layer: pre-LLM gates intercept crisis and eating disorder signals; post-LLM validation blocks allergens and routes drug-food interactions to pharmacist referral. The moat is operational — a documented human review process, a clinical advisory layer, and a curation pipeline that competitors cannot replicate quickly — not the underlying model. As the EU AI Act (fully applicable from 2027) raises the bar for health-adjacent AI systems, this architecture is already structured for compliance. Competitors retrofitting safety into systems not designed for it will need 18–24 months of legal and engineering work.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Safety Architecture */}
        <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4E48', marginBottom: 8 }}>AI &amp; Clinical Safety Architecture</p>
        <div style={{ marginBottom: 18 }}>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — A wellness app giving AI dietary advice sounds like a regulatory minefield. How do you manage that risk?</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginBottom: 8 }}>We built clinical safety infrastructure from day one, not as a retrofit. The AI Digital Advisor runs a four-layer safety pipeline before any recommendation reaches the user:</p>
            {[
              ['Pre-flight crisis detection', 'Emotional distress and suicidal ideation signals are intercepted before the LLM is ever called. The system returns a structured referral with local crisis resources (Spain: 024 line; Mexico: SAPTEL) — the model never processes the input.'],
              ['Pre-flight TCA detection', 'Eating disorder signals (restriction, purging, compensation, merit-based eating cognitions) trigger immediate referral to specialist services. Pattern library designed and reviewed by the founder in her clinical capacity.'],
              ['Post-flight allergen blocking', 'Every AI-generated recipe is validated against the user\'s declared allergens. Any match throws a hard error — the recommendation is never delivered.'],
              ['Post-flight drug-food interaction routing', 'Pharmacologically significant food-drug combinations (e.g. MAOIs + aged cheese, statins + grapefruit, warfarin + vitamin K foods) either add a caution warning or block the recommendation and derive to a pharmacist. No recommendation is delivered when safety cannot be guaranteed.'],
            ].map(([label, text]) => (
              <div key={label} style={{ paddingLeft: 12, borderLeft: '2px solid #E0EDE6', marginBottom: 10 }}>
                <p style={{ fontSize: 10, color: '#1A1612', fontWeight: 600, margin: 0 }}>{label}</p>
                <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 3 }}>{text}</p>
              </div>
            ))}
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 10 }}>The underlying model is Anthropic Claude (a general-purpose LLM). The moat is not the model — it is the operational layer around it: a documented safety filter pipeline, a founder-designed curation process, and a human review protocol that competitors cannot replicate quickly. The entire pipeline is covered by automated tests (Vitest). We operate as a wellness and lifestyle application, not a medical device: no diagnosis, no therapeutic claims, no clinical efficacy statements. We have reviewed MDCG 2025-4 (the EU guidance distinguishing Medical Device Software from wellness apps) and confirmed our claims and architecture stay firmly in the lifestyle category. On EU AI Act classification, Food·Mood does not make clinical decisions, diagnose conditions, or influence safety-critical outcomes — placing it outside the high-risk AI category (Annex III). Full compliance timeline aligns with the 2027 applicability deadline.</p>
          </div>
        </div>

        {/* Business Model & Unit Economics */}
        <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4E48', marginBottom: 8 }}>Business Model &amp; Unit Economics</p>
        <div style={{ marginBottom: 18 }}>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — €9/month sounds cheap. How do you reach €2.4M ARR at those prices?</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginBottom: 8 }}>€9/month is the retention anchor, not the growth engine. The model is challenge-first acquisition → subscription retention:</p>
            {[
              'Challenge €19–29: low-friction entry point, high intent, clear promise (energy, focus, hormonal reset, sleep)',
              'Challenge → subscription conversion: target 15% (wellness app benchmark)',
              'Subscription retention: target 85% at 3 months · 70% at 12 months',
              'Corporate Wellness: €490 pilot / €12 per employee — one mid-size contract = 50+ B2C subscribers in a single transaction',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#3A8C62', fontWeight: 700, flexShrink: 0, fontSize: 10 }}>·</span>
                <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.55, margin: 0 }}>{item}</p>
              </div>
            ))}
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 10 }}>The path to €2.4M ARR is not €9 × 22,000 pure subscribers. It is 22,000 subscribers who entered through challenges, completed transformations, and stayed because the Food·Mood Index demonstrates measurable value. Estimated LTV: <strong style={{ color: '#1A1612' }}>€150–200</strong> vs. target CAC: <strong style={{ color: '#1A1612' }}>&lt;€40</strong>.</p>
          </div>
        </div>

        {/* Use of Funds & Runway */}
        <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4E48', marginBottom: 8 }}>Use of Funds &amp; Runway</p>
        <div style={{ marginBottom: 18 }}>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — €140K for 18 months seems tight. What happens if you don&apos;t hit Q3 2027 milestones?</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginBottom: 8 }}>The runway is designed with buffers:</p>
            {[
              'Conservative scenario: If we only reach 1,000 challenges and 200 subscribers at 18 months, we generate ~€45K revenue — extending runway by 3–4 additional months.',
              'Pivot option: If B2C does not scale as expected, Corporate Wellness has shorter sales cycles and higher ticket size. A single B2B pilot at €490 = 16 B2C subscriber equivalents.',
              'Cost structure: 75% of costs are variable or reducible — marketing is pausable, content is founder-generated, infrastructure is serverless on Vercel / Supabase.',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#3A8C62', fontWeight: 700, flexShrink: 0, fontSize: 10 }}>·</span>
                <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.55, margin: 0 }}>{item}</p>
              </div>
            ))}
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 10 }}>We do not need to hit Q3 2027 milestones to survive. We need to hit them to raise Seed on strong terms. If we miss, we have extension options without burning the cap table.</p>
          </div>
        </div>

        {/* Risk Transparency */}
        <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5A4E48', marginBottom: 8 }}>Risk Transparency</p>
        <div style={{ marginBottom: 4 }}>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>Q — What are the real risks that could kill this business?</p>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginBottom: 10 }}>Full transparency:</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9 }}>
              <thead>
                <tr>
                  {['Risk', 'Probability', 'Impact', 'Mitigation'].map(h => (
                    <th key={h} style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A4E48', padding: '0 8px 6px 0', textAlign: 'left', borderBottom: '1px solid #E0EDE6', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Founder burnout', 'Medium', 'High', 'Co-founder alleviates ops; hire #1 technical planned for Q1 2027'],
                  ['CAC higher than €40', 'Medium', 'High', '70% of growth budget on organic/community/PR; paid only as accelerator'],
                  ['Subscriber churn >10%/month', 'Low', 'High', 'Challenge-first model pre-qualifies high-intent users; Food·Mood Index increases engagement'],
                  ['EU AI Act / MDR classification risk', 'Low', 'Medium', 'Reviewed MDCG 2025-4: app stays on lifestyle side of MDSW line (no diagnosis, no clinical decisions, no efficacy claims). EU AI Act: not high-risk under Annex III. Full compliance timeline: 2027. NIS2 and EHDS monitored as thresholds evolve.'],
                  ['Big Tech Spanish localization', 'Low', 'Medium', '18–24 month content head start; dataset as long-term moat'],
                ].map(([risk, prob, impact, mit]) => (
                  <tr key={risk} style={{ borderBottom: '1px solid #F0EDE4' }}>
                    <td style={{ padding: '6px 8px 6px 0', color: '#1A1612', fontSize: 9, fontWeight: 500 }}>{risk}</td>
                    <td style={{ padding: '6px 8px 6px 0', color: prob === 'Medium' ? '#C9A84C' : '#3A8C62', fontSize: 9 }}>{prob}</td>
                    <td style={{ padding: '6px 8px 6px 0', color: impact === 'High' ? '#B85450' : '#C9A84C', fontSize: 9 }}>{impact}</td>
                    <td style={{ padding: '6px 0', color: '#3D3028', fontSize: 9, lineHeight: 1.5 }}>{mit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65, marginTop: 12 }}>The #1 real risk is founder time — which is why the use of funds includes €50K in Product &amp; Tech to delegate development and free the founder&apos;s time for growth and content.</p>
          </div>
        </div>

        <div style={{ marginTop: 28, paddingTop: 12, borderTop: '1px solid #E0EDE6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: '#3A8C62', letterSpacing: '0.08em', lineHeight: 1.7 }}>
            Susana Ferreras Diez · CEO &amp; Founder<br />
            www.food-mood.app · info@food-mood.app
          </div>
          <div style={{ fontSize: 7, color: '#5A4E48', textAlign: 'right', maxWidth: 340, lineHeight: 1.5 }}>
            This document is confidential and intended solely for the recipient. All projections are forward-looking estimates and not guarantees of future performance.
          </div>
        </div>

        {/* Download */}
        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="/pitch-deck-pre-seed-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3A8C62', border: '1px solid #E0EDE6', borderRadius: 4, padding: '7px 14px', textDecoration: 'none' }}
          >
            ↓ Pitch Deck PDF
          </a>
          <a
            href="/inversores/safety-architecture"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3A8C62', border: '1px solid #3A8C62', borderRadius: 4, padding: '7px 14px', textDecoration: 'none' }}
          >
            ↓ AI Safety Architecture (PDF)
          </a>
          <a
            href="mailto:info@food-mood.app?subject=Food·Mood Pre-Seed — Investor Interest"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F9F7F2', background: '#1A1612', borderRadius: 4, padding: '7px 14px', textDecoration: 'none' }}
          >
            → Contact the founder
          </a>
        </div>
      </div>
    </main>
  )
}

const bodyP: React.CSSProperties = { fontSize: 10.5, color: '#1A1612', lineHeight: 1.72, marginTop: 8 }

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
