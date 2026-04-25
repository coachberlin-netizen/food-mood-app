'use client'

import { useState } from 'react'

const ACCENT = '#7B4B8C'
const ACCENT_LIGHT = '#f3edf7'
const BORDER = '#e8ddd5'
const TEXT_MAIN = '#2a1a1e'
const TEXT_MUTED = '#9e8080'

interface RefLink { label: string; url: string }

interface Item {
  id: string
  titulo: string
  cuerpo: string
  refs: RefLink[]
}

const ITEMS: Item[] = [
  {
    id: 'alimentacion',
    titulo: 'Alimentación y transición hormonal',
    cuerpo:
      'Durante la transición hormonal, la calidad global de la dieta influye en energía, composición corporal, salud ósea, sensibilidad metabólica y bienestar general. Por eso el programa prioriza proteínas suficientes, fibra, grasas de calidad y micronutrientes clave dentro de una estructura diaria fácil de sostener.',
    refs: [
      { label: 'AESAN — Alimentación y menopausia', url: 'https://www.aesan.gob.es/AECOSAN/docs/documentos/publicaciones/revistas_comite_cientifico/MENOPAUSIA.pdf' },
      { label: 'AESAN — Hábitos alimentarios para prevenir riesgos en menopausia', url: 'https://www.dsca.gob.es/es/comunicacion/notas-prensa/informe-aesan-detalla-habitos-alimentarios-prevenir-riesgos-menopausia' },
    ],
  },
  {
    id: 'sop',
    titulo: 'SOP, sensibilidad a la insulina y patrón dietético',
    cuerpo:
      'En el síndrome de ovario poliquístico, una parte importante de los síntomas se relaciona con resistencia a la insulina y composición corporal. Los metaanálisis disponibles muestran que la intervención dietética puede mejorar marcadores de insulinorresistencia, peso y glucosa. La alimentación es, por tanto, una base terapéutica respaldada por evidencia.',
    refs: [
      { label: 'Diet and insulin resistance in PCOS (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/32621748/' },
      { label: 'Time-restricted eating and PCOS — metabolic markers (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9507776/' },
    ],
  },
  {
    id: 'microbiota',
    titulo: 'Microbiota, fermentados y metabolismo de estrógenos',
    cuerpo:
      'La microbiota intestinal participa en el metabolismo de estrógenos a través del llamado estroboloma, un conjunto de genes bacterianos implicados en su reciclaje y disponibilidad. Revisiones recientes sugieren que este eje microbiota‑estrógenos gana relevancia en perimenopausia, lo que justifica trabajar con fibra, diversidad vegetal y fermentados dentro del programa.',
    refs: [
      { label: 'Gut microbiota and menopausal health (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/40551890/' },
      { label: 'Diet, gut microbiome and estrogen physiology (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13074627/' },
      { label: 'Estrogen–gut microbiome axis (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/28778332/' },
    ],
  },
  {
    id: 'triptofano',
    titulo: 'Triptófano, serotonina, melatonina y sueño',
    cuerpo:
      'El triptófano es precursor de serotonina y melatonina, compuestos clave en sueño, estado de ánimo y regulación circadiana. La evidencia disponible sugiere que apoyar su presencia dietética puede mejorar la calidad del sueño, especialmente en lo que respecta a la vigilia nocturna, un síntoma frecuente en la transición hormonal.',
    refs: [
      { label: 'Tryptophan and sleep quality (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/33942088/' },
      { label: 'L-tryptophan and sleep (PubMed 1982)', url: 'https://pubmed.ncbi.nlm.nih.gov/6764927/' },
    ],
  },
  {
    id: 'estres',
    titulo: 'Estrés crónico, sistema nervioso y cronobiología',
    cuerpo:
      'El estrés sostenido altera el apetito, el sueño, el ritmo circadiano y la percepción de síntomas. Por eso el programa no se centra solo en qué comer, sino también en cuándo y con qué constancia. La literatura reciente conecta además microbiota y síntomas emocionales en la transición perimenopáusica, reforzando una mirada que integra sistema nervioso, intestino y hábitos.',
    refs: [
      { label: 'Perimenopausal anxiety and gut microbiota (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/41829913/' },
      { label: 'Diet, gut microbiome and estrogen physiology (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC13074627/' },
    ],
  },
  {
    id: 'seguimiento',
    titulo: 'Seguimiento diario, adherencia y cambio medible',
    cuerpo:
      'Registrar síntomas, energía, sueño, digestión y bienestar ayuda a detectar patrones y mejora la adherencia a una intervención. El valor del programa no está solo en el contenido, sino en convertir recomendaciones dispersas en un protocolo estructurado de 28 días con seguimiento real y lectura personalizada del proceso.',
    refs: [
      { label: 'Diet intervention in PCOS — adherence outcomes (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/32621748/' },
      { label: 'Time-restricted eating and metabolic markers in PCOS (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9507776/' },
    ],
  },
]

function AccordionItem({ item, open, onToggle }: { item: Item; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`panel-${item.id}`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 12,
        }}
      >
        <h3 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '15px',
          fontWeight: 500,
          color: open ? ACCENT : TEXT_MAIN,
          lineHeight: 1.35,
          margin: 0,
          transition: 'color .2s',
        }}>
          {item.titulo}
        </h3>
        <span style={{
          flexShrink: 0,
          width: 22, height: 22,
          borderRadius: '50%',
          border: `1.5px solid ${open ? ACCENT : BORDER}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: open ? ACCENT : TEXT_MUTED,
          fontSize: 14,
          transition: 'all .2s',
          fontWeight: 400,
        }}>
          {open ? '−' : '+'}
        </span>
      </button>

      <div
        id={`panel-${item.id}`}
        role="region"
        hidden={!open}
        style={{
          overflow: 'hidden',
          maxHeight: open ? '600px' : '0',
          transition: 'max-height .3s ease',
          paddingBottom: open ? '20px' : '0',
        }}
      >
        <p style={{
          fontSize: '14px',
          lineHeight: 1.7,
          color: '#4a3a3e',
          marginBottom: '14px',
          marginTop: 0,
        }}>
          {item.cuerpo}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {item.refs.map(r => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '11px',
                fontWeight: 600,
                color: ACCENT,
                background: ACCENT_LIGHT,
                borderRadius: '20px',
                padding: '4px 10px',
                textDecoration: 'none',
                letterSpacing: '0.01em',
              }}
            >
              <span style={{ fontSize: 10 }}>↗</span> {r.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function BaseCientifica() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section
      id="base-cientifica"
      aria-labelledby="base-cientifica-titulo"
      style={{
        background: '#fff',
        borderRadius: '16px',
        border: `1px solid ${BORDER}`,
        padding: '28px 24px',
        marginBottom: '16px',
      }}
    >
      <p style={{
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: TEXT_MUTED,
        marginBottom: '6px',
        marginTop: 0,
      }}>
        Evidencia
      </p>

      <h2
        id="base-cientifica-titulo"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '20px',
          fontWeight: 500,
          color: TEXT_MAIN,
          margin: '0 0 10px',
          lineHeight: 1.3,
        }}
      >
        Base científica del programa
      </h2>

      <p style={{
        fontSize: '13px',
        lineHeight: 1.65,
        color: TEXT_MUTED,
        marginBottom: '20px',
        marginTop: 0,
      }}>
        Este programa se apoya en evidencia sobre alimentación, microbiota, sueño, cronobiología y salud metabólica femenina.
        La intervención está diseñada como apoyo nutricional y de hábitos — especialmente en{' '}
        <strong style={{ color: TEXT_MAIN, fontWeight: 600 }}>perimenopausia, SOP y desequilibrios relacionados con el estrés</strong> —,
        sin sustituir atención médica cuando es necesaria.
      </p>

      <div>
        {ITEMS.map(item => (
          <AccordionItem
            key={item.id}
            item={item}
            open={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: '22px',
        padding: '14px 16px',
        borderRadius: '10px',
        background: '#fafaf8',
        borderLeft: `3px solid ${ACCENT}`,
      }}>
        <p style={{
          fontSize: '12px',
          lineHeight: 1.65,
          color: TEXT_MUTED,
          margin: 0,
        }}>
          <strong style={{ color: TEXT_MAIN }}>Nota:</strong>{' '}
          Este programa no sustituye valoración médica, analíticas ni tratamiento farmacológico cuando está indicado.
          Está diseñado como apoyo nutricional y de hábitos dentro de un enfoque integral de salud femenina.
        </p>
      </div>
    </section>
  )
}
