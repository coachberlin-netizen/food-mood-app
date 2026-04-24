"use client"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 480, width: '100%', padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', fontWeight: 700, color: '#2d0f16', marginBottom: '1rem' }}>
            Error detectado
          </p>
          <pre style={{ fontSize: '0.75rem', background: 'white', borderRadius: 12, padding: '1rem', border: '1px solid rgba(107,39,55,0.1)', color: '#6B2737', textAlign: 'left', overflowX: 'auto', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
            {error?.message || 'Sin mensaje'}
            {'\n'}
            {error?.stack?.split('\n').slice(0, 6).join('\n')}
            {error?.digest ? `\n\nDigest: ${error.digest}` : ''}
          </pre>
          <button onClick={reset} style={{ padding: '0.75rem 1.5rem', borderRadius: 99, background: '#6B2737', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Reintentar
          </button>
        </div>
      </body>
    </html>
  )
}
