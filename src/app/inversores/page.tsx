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

        <p style={{ marginTop: 28, fontSize: 11, color: 'rgba(245,240,232,0.2)' }}>
          No key? Contact info@food-mood.app
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
              Raising <strong style={{ color: '#1A1612' }}>€140,000</strong> on a <strong style={{ color: '#1A1612' }}>post-money SAFE</strong> — <strong style={{ color: '#1A1612' }}>€800K valuation cap</strong> (~17.5% implied dilution), <strong style={{ color: '#1A1612' }}>20% discount</strong>. Standard European pre-seed terms. The SAFE avoids a full priced equity round today while giving early investors clear upside through the cap and discount when it converts at Seed.
            </p>
            <p style={{ fontSize: 10, color: '#3D3028', lineHeight: 1.65, marginTop: 8 }}>
              Valuation is driven by founder profile, product readiness, and market potential — not revenue metrics. At an €800K cap with a 20% discount, this is an attractive early entry point into a category with no established Spanish-language competitor.
            </p>
          </div>
          <div style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 16px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#3A8C62', marginBottom: 8 }}>Round structure</p>
            {[
              ['Instrument', 'Post-money SAFE'],
              ['Raise', '€140,000'],
              ['Valuation cap', '€800,000'],
              ['Discount', '20% at Seed conversion'],
              ['Use of funds', '18-month focused launch'],
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
            <p style={bodyP}>Smartphone penetration in LATAM crossed 70% in 2024. App spending among women 40+ grew 34% in 2023 (Sensor Tower). Yet every evidence-based gut-brain wellness app is English-only. Psychobiotic research has matured for consumer products, and the EU regulatory environment (GDPR, Digital Health Act) favours privacy-first European platforms. The window to become the category-defining Spanish-language app for women 45+ is open — and uncontested.</p>
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
              {['App', 'Language', 'Gut-brain science', 'Women 45+', 'Spanish market', 'Model', '€/mo'].map(h => (
                <th key={h} style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A4E48', padding: '0 8px 6px 0', textAlign: 'left', borderBottom: '1px solid #F0EDE4', fontWeight: 400 }}>{h}</th>
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
                <td style={{ padding: '6px 8px 6px 0', color: '#2A2218', fontSize: 9.5 }}>{app}</td>
                <td style={{ padding: '6px 8px 6px 0', color: '#3D3028', fontSize: 9 }}>{lang}</td>
                <td style={{ padding: '6px 8px 6px 0', color: gut === '✗' ? '#C0B8B0' : '#3A8C62', fontSize: 9 }}>{gut}</td>
                <td style={{ padding: '6px 8px 6px 0', color: w45 === '✗' ? '#C0B8B0' : '#3A8C62', fontSize: 9 }}>{w45}</td>
                <td style={{ padding: '6px 8px 6px 0', color: es === '✗' ? '#C0B8B0' : '#3A8C62', fontSize: 9 }}>{es}</td>
                <td style={{ padding: '6px 8px 6px 0', color: '#3D3028', fontSize: 9 }}>{model}</td>
                <td style={{ padding: '6px 0', color: '#3D3028', fontSize: 9, fontFamily: 'monospace' }}>{price}</td>
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
        <p style={{ fontSize: 8.5, color: '#5A4E48', marginTop: 6, fontStyle: 'italic', lineHeight: 1.5 }}>
          △ Elektra Health addresses symptoms; does not integrate nutritional science. No competitor offers gut-brain nutrition in Spanish for perimenopause/menopause.
        </p>

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
          {[
            {
              q: 'Is the founder fully committed? The €1,500/month salary suggests other income sources.',
              a: 'The €1,500/month salary for the first 18 months is the minimum viable amount to maintain exclusive focus on Food·Mood without burning personal reserves. This reflects capital discipline — 87% of the round goes directly to product, growth, and validation — not lack of commitment. Unlike founders who pay themselves €4–5K/month at pre-seed and burn runway in 12 months, this structure maximises runway length. Full market-rate compensation will normalise at Seed stage.',
            },
            {
              q: 'Is this a solo-founder risk?',
              a: 'No. I have a co-founder / partner handling administration, operations, and compliance. My role covers product, science, technology, and content; theirs covers the operational infrastructure that allows me to build. This division mitigates "bus factor" risk — the company does not depend on a single person to function.',
            },
            {
              q: "What is the founder's prior financial track record? Was the kombucha brand profitable?",
              a: 'The kombucha brand was highly profitable. We sold the recipes and operations to pivot to digital — a deliberate strategic exit, not a failure shutdown. I remain a food tech consultant specialising in kombucha (recipes, operations, admin, scaling, and food safety), which provides supplementary income that enables the minimum salary at Food·Mood without distracting from the core focus. This background is an asset: it demonstrates the ability to build profitable food/wellness businesses, execute exits, and maintain industry relationships that can open doors for the B2B Corporate Wellness channel.',
            },
            {
              q: 'Why is the valuation cap set at €800K?',
              a: 'Lowering the cap to €800,000 is a deliberate strategic choice, not a sign of weakness. In the European pre-seed market (2025–2026), deals with an MVP but no user traction typically close between €600K–€1.0M. At €800K with a 20% discount, we are offering early investors an attractive entry point into a category with no established competitor, clear upside at Seed conversion (€800K effective pre-money vs. a potential Seed valuation of €3–5M), and aligned incentives: I prefer higher dilution now and a committed investor table, rather than an inflated cap that delays closing or creates down-round tension later.',
            },
          ].map(({ q, a }) => (
            <div key={q} style={{ background: '#FAFAF7', border: '1px solid #E0EDE6', borderRadius: 6, padding: '14px 18px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.08em', color: '#3A8C62', textTransform: 'uppercase', marginBottom: 6, lineHeight: 1.5 }}>
                Q — {q}
              </p>
              <p style={{ fontSize: 10, color: '#2A2218', lineHeight: 1.65 }}>
                {a}
              </p>
            </div>
          ))}
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
