import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Link,
} from "@react-email/components"
import * as React from "react"

interface CuratedItem {
  category: string
  title: string
  summary: string | null
  url: string | null
}

interface WeeklyDigestEmailProps {
  weekLabel:         string   // "14 – 20 abril 2026"
  fmIndexAvg:        number | null
  fmIndexChange:     number | null
  bestDayLabel:      string | null
  bestDayIndex:      number | null
  correlation1:      string | null
  correlation2:      string | null
  correlation3:      string | null
  recordBroken:      boolean
  curatedItems:      CuratedItem[]
  appUrl:            string
}

const BURG  = "#6B2737"
const CREAM = "#F5F0E8"
const GOLD  = "#C9A84C"
const DARK  = "#2d0f16"

const CATEGORY_EMOJI: Record<string, string> = {
  neurociencia:   "🧬",
  alimentacion:   "🌿",
  psicologia:     "🧠",
  longevidad:     "🔬",
  biotecnologia:  "💊",
}

export default function WeeklyDigestEmail({
  weekLabel,
  fmIndexAvg,
  fmIndexChange,
  bestDayLabel,
  bestDayIndex,
  correlation1,
  correlation2,
  correlation3,
  recordBroken,
  curatedItems,
  appUrl,
}: WeeklyDigestEmailProps) {
  const changeSign   = fmIndexChange != null && fmIndexChange >= 0 ? "↑" : "↓"
  const changeAbs    = fmIndexChange != null ? Math.abs(fmIndexChange) : null
  const correlations = [correlation1, correlation2, correlation3].filter(Boolean) as string[]

  return (
    <Html lang="es">
      <Head />
      <Preview>Tu semana Food·Mood · {weekLabel}</Preview>
      <Body style={{ backgroundColor: CREAM, fontFamily: "Georgia, serif", margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "0 16px" }}>

          {/* ── Header ── */}
          <Section style={{ paddingTop: "32px", paddingBottom: "16px", textAlign: "center" }}>
            <Heading
              style={{ fontSize: "26px", color: DARK, margin: 0, letterSpacing: "-0.5px" }}
            >
              Food<span style={{ color: GOLD }}>·</span>Mood
            </Heading>
            <Text style={{ color: BURG, fontSize: "11px", letterSpacing: "0.15em", margin: "6px 0 0", textTransform: "uppercase" }}>
              Tu semana · {weekLabel}
            </Text>
          </Section>

          <Hr style={{ borderColor: "rgba(107,39,55,0.12)", margin: "0 0 24px" }} />

          {/* ── Sección 1: Resumen personal ── */}
          <Section style={{ backgroundColor: DARK, borderRadius: "16px", padding: "28px 24px", marginBottom: "24px" }}>
            <Text style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 14px" }}>
              Tu resumen personal
            </Text>

            {/* FM Index */}
            {fmIndexAvg != null && (
              <Section style={{ marginBottom: "20px" }}>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 4px" }}>
                  Índice Food·Mood esta semana
                </Text>
                <Text style={{ fontSize: "42px", fontWeight: "900", color: GOLD, margin: "0", lineHeight: "1" }}>
                  {fmIndexAvg}
                  {changeAbs != null && (
                    <span style={{ fontSize: "14px", fontWeight: "400", color: "rgba(255,255,255,0.6)", marginLeft: "8px" }}>
                      {changeSign} {changeAbs} vs sem. anterior
                    </span>
                  )}
                </Text>
              </Section>
            )}

            {/* Mejor día */}
            {bestDayLabel && bestDayIndex != null && (
              <Section style={{ marginBottom: "20px" }}>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 4px" }}>
                  Tu mejor día
                </Text>
                <Text style={{ color: "white", fontSize: "15px", margin: 0 }}>
                  {bestDayLabel} — índice {bestDayIndex}
                </Text>
              </Section>
            )}

            {/* Récord */}
            {recordBroken && (
              <Section style={{ backgroundColor: "rgba(201,168,76,0.15)", borderRadius: "10px", padding: "10px 14px", marginBottom: "20px" }}>
                <Text style={{ color: GOLD, fontSize: "13px", margin: 0 }}>
                  🏆 ¡Nuevo récord personal esta semana!
                </Text>
              </Section>
            )}

            {/* Correlaciones */}
            {correlations.length > 0 && (
              <Section>
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px" }}>
                  Tus correlaciones
                </Text>
                {correlations.map((c, i) => (
                  <Section
                    key={i}
                    style={{ borderLeft: `3px solid ${GOLD}`, paddingLeft: "12px", marginBottom: "12px" }}
                  >
                    <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", fontStyle: "italic", lineHeight: "1.6", margin: 0 }}>
                      {c}
                    </Text>
                  </Section>
                ))}
              </Section>
            )}
          </Section>

          {/* ── CTA ver semana ── */}
          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Button
              href={`${appUrl}/semana`}
              style={{
                backgroundColor: BURG,
                color: "white",
                padding: "14px 32px",
                borderRadius: "40px",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Ver mi semana completa →
            </Button>
          </Section>

          <Hr style={{ borderColor: "rgba(107,39,55,0.12)", margin: "0 0 28px" }} />

          {/* ── Sección 2: Curated ── */}
          {curatedItems.length > 0 && (
            <Section style={{ marginBottom: "32px" }}>
              <Text style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 18px" }}>
                Lo que importa saber esta semana
              </Text>
              {curatedItems.map((item, i) => (
                <Section
                  key={i}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "16px 18px",
                    marginBottom: "10px",
                  }}
                >
                  <Text style={{ color: GOLD, fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 4px" }}>
                    {CATEGORY_EMOJI[item.category] ?? "📌"} {item.category}
                  </Text>
                  <Text style={{ color: DARK, fontSize: "14px", fontWeight: "600", margin: "0 0 4px" }}>
                    {item.title}
                  </Text>
                  {item.summary && (
                    <Text style={{ color: "rgba(107,39,55,0.7)", fontSize: "12px", lineHeight: "1.6", margin: "0 0 6px" }}>
                      {item.summary}
                    </Text>
                  )}
                  {item.url && (
                    <Link href={item.url} style={{ color: BURG, fontSize: "11px", fontWeight: "600" }}>
                      Leer más →
                    </Link>
                  )}
                </Section>
              ))}
            </Section>
          )}

          {/* ── Footer ── */}
          <Hr style={{ borderColor: "rgba(107,39,55,0.12)", margin: "0 0 20px" }} />
          <Section style={{ paddingBottom: "32px", textAlign: "center" }}>
            <Text style={{ color: "rgba(107,39,55,0.4)", fontSize: "11px", margin: "0 0 4px" }}>
              Food·Mood · food-mood.app · © 2026
            </Text>
            <Text style={{ color: "rgba(107,39,55,0.3)", fontSize: "10px", margin: 0 }}>
              Recibes este email porque eres parte de la comunidad Food·Mood.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
