"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, ShoppingBasket, ChevronDown, ChevronUp } from "lucide-react"

interface Categoria {
  categoria: string
  items:     string[]
}

interface Props {
  slug:        string
  title:       string
  color:       string
  listaCompra: Categoria[]
}

export default function ListaCompraClient({ slug, title, color, listaCompra }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const totalItems   = listaCompra.flatMap(c => c.items).length
  const checkedCount = checked.size

  function toggle(item: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }

  function toggleCat(cat: string) {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  function markAll() {
    setChecked(new Set(listaCompra.flatMap(c => c.items)))
  }

  return (
    <main className="min-h-screen pb-32" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-2xl mx-auto px-6 pt-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color }}>
            Paso 1 · Antes de empezar
          </p>
          <h1 className="font-serif text-4xl font-black leading-tight mb-3" style={{ color: "#2d0f16" }}>
            Tu lista de la compra
          </h1>
          <p className="text-base font-light leading-relaxed" style={{ color: "rgba(45,15,22,0.55)" }}>
            Todo lo que necesitas para los 10 días. Compra lo que puedas esta semana — el resto lo irás incorporando.
          </p>
        </div>

        {/* Progreso */}
        <div className="bg-white rounded-2xl p-5 mb-8 flex items-center justify-between shadow-sm"
          style={{ border: "1px solid rgba(45,15,22,0.06)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#2d0f16" }}>
              {checkedCount} de {totalItems} productos
            </p>
            <p className="text-xs font-light mt-0.5" style={{ color: "rgba(45,15,22,0.4)" }}>
              {checkedCount === totalItems ? "¡Lista completa!" : "Marca lo que ya tienes"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {checkedCount < totalItems && (
              <button type="button" onClick={markAll}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{ color, border: `1px solid ${color}20`, background: `${color}10` }}>
                Tengo todo
              </button>
            )}
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(45,15,22,0.08)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
                  strokeDasharray={`${(checkedCount / Math.max(totalItems, 1)) * 100} 100`}
                  strokeLinecap="round" />
              </svg>
              <ShoppingBasket className="absolute inset-0 m-auto w-4 h-4" style={{ color }} />
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="flex flex-col gap-4 mb-12">
          {listaCompra.map(({ categoria, items }) => {
            const isCollapsed   = collapsed.has(categoria)
            const catChecked    = items.filter(i => checked.has(i)).length
            const allCatChecked = catChecked === items.length

            return (
              <div key={categoria} className="bg-white rounded-2xl overflow-hidden shadow-sm"
                style={{ border: "1px solid rgba(45,15,22,0.06)" }}>
                <button type="button" onClick={() => toggleCat(categoria)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-black/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    {allCatChecked && (
                      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: color }}>
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    )}
                    <span className="text-sm font-semibold" style={{ color: "#2d0f16" }}>{categoria}</span>
                    <span className="text-xs" style={{ color: "rgba(45,15,22,0.35)" }}>
                      {catChecked}/{items.length}
                    </span>
                  </div>
                  {isCollapsed
                    ? <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "rgba(45,15,22,0.3)" }} />
                    : <ChevronUp   className="w-4 h-4 shrink-0" style={{ color: "rgba(45,15,22,0.3)" }} />
                  }
                </button>

                {!isCollapsed && (
                  <ul className="px-5 pb-4 flex flex-col gap-1 border-t" style={{ borderColor: "rgba(45,15,22,0.05)" }}>
                    {items.map(item => {
                      const done = checked.has(item)
                      return (
                        <li key={item}>
                          <button type="button" onClick={() => toggle(item)}
                            className="w-full flex items-start gap-3 py-2.5 text-left transition-opacity"
                            style={{ opacity: done ? 0.4 : 1 }}>
                            <span className="shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors"
                              style={{
                                borderColor: done ? color : "rgba(45,15,22,0.2)",
                                backgroundColor: done ? color : "transparent",
                              }}>
                              {done && <Check className="w-3 h-3 text-white" />}
                            </span>
                            <span className="text-sm font-light leading-snug" style={{ color: "#2d0f16", textDecoration: done ? "line-through" : "none" }}>
                              {item}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-4"
          style={{ background: "linear-gradient(to top, #F5F0E8 70%, transparent)" }}>
          <div className="max-w-2xl mx-auto">
            <Link href={`/retos/${slug}/dia/1`}
              className="block w-full text-center py-4 rounded-full text-base font-bold text-white transition-all hover:opacity-90 shadow-lg"
              style={{ backgroundColor: color }}>
              Empezar día 1 →
            </Link>
            <p className="text-center text-xs mt-2" style={{ color: "rgba(45,15,22,0.35)" }}>
              No necesitas tenerlo todo — empieza con lo que tienes
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
