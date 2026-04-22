"use client";

import { useState, useEffect, useTransition } from 'react';
import { saveNewsletterItemAction, deleteNewsletterItemAction, getNewsletterItemsByWeek } from './actions';

const CATEGORIES = [
  { value: 'neurociencia',  label: '🧬 Neurociencia'  },
  { value: 'alimentacion',  label: '🌿 Alimentación'  },
  { value: 'psicologia',    label: '🧠 Psicología'    },
  { value: 'longevidad',    label: '🔬 Longevidad'    },
  { value: 'biotecnologia', label: '💊 Biotecnología' },
] as const;

function getCurrentMonday(): string {
  const d   = new Date();
  const day = d.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

interface Item {
  id: string;
  category: string;
  title: string;
  summary: string | null;
  url: string | null;
  week_start: string;
  is_active: boolean;
}

export default function AdminNewsletterPage() {
  const [weekStart, setWeekStart]   = useState(getCurrentMonday());
  const [category,  setCategory]    = useState<string>('neurociencia');
  const [title,     setTitle]       = useState('');
  const [summary,   setSummary]     = useState('');
  const [url,       setUrl]         = useState('');
  const [items,     setItems]       = useState<Item[]>([]);
  const [error,     setError]       = useState<string | null>(null);
  const [success,   setSuccess]     = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  async function loadItems() {
    try {
      const data = await getNewsletterItemsByWeek(weekStart);
      setItems(data as Item[]);
    } catch {
      // ignore load errors silently
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim()) { setError('El título es obligatorio.'); return; }

    startTransition(async () => {
      try {
        await saveNewsletterItemAction({
          week_start:   weekStart,
          category:     category as any,
          title:        title.trim(),
          summary:      summary.trim(),
          external_url: url.trim(),
        });
        setTitle('');
        setSummary('');
        setUrl('');
        setSuccess(true);
        await loadItems();
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err.message ?? 'Error desconocido');
      }
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este item?')) return;
    startTransition(async () => {
      try {
        await deleteNewsletterItemAction(id);
        await loadItems();
      } catch (err: any) {
        setError(err.message ?? 'Error al eliminar');
      }
    });
  }

  return (
    <div className="space-y-12">

      {/* ── Selector de semana ── */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-semibold text-aubergine-dark">
          Semana del lunes:
        </label>
        <input
          type="date"
          value={weekStart}
          onChange={e => setWeekStart(e.target.value)}
          className="border border-aubergine-dark/20 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
      </div>

      {/* ── Formulario ── */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-aubergine-dark/8 shadow-sm space-y-6">
        <h2 className="text-xl font-serif font-bold text-aubergine-dark">Añadir item</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">
              Categoría *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-aubergine-dark/20 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">
              URL externa
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-aubergine-dark/20 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Un nuevo estudio sobre el eje intestino-cerebro..."
            className="w-full border border-aubergine-dark/20 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">
            Resumen
          </label>
          <textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
            rows={3}
            placeholder="Breve descripción del contenido..."
            className="w-full border border-aubergine-dark/20 rounded-lg px-3 py-2.5 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 font-medium">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-700 font-medium">✓ Item guardado correctamente.</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-full bg-[#6B2737] text-white text-sm font-bold hover:bg-[#5a2030] transition-colors disabled:opacity-50"
        >
          {isPending ? 'Guardando…' : '+ Añadir item'}
        </button>
      </form>

      {/* ── Items de la semana ── */}
      <div>
        <h2 className="text-xl font-serif font-bold text-aubergine-dark mb-6">
          Items de la semana {weekStart}
          <span className="ml-3 text-sm font-sans font-normal text-aubergine-dark/40">
            ({items.length} items)
          </span>
        </h2>

        {items.length === 0 ? (
          <p className="text-sm text-aubergine-dark/40 italic">No hay items para esta semana.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-5 border border-aubergine-dark/8 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B2737]">
                    {CATEGORIES.find(c => c.value === item.category)?.label ?? item.category}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors shrink-0"
                  >
                    Eliminar
                  </button>
                </div>
                <p className="font-serif text-sm font-semibold text-aubergine-dark leading-snug">
                  {item.title}
                </p>
                {item.summary && (
                  <p className="text-xs text-aubergine-dark/55 font-light leading-relaxed">
                    {item.summary}
                  </p>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#6B2737] hover:underline truncate"
                  >
                    {item.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
