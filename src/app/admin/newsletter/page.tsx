"use client";

import { useState, useEffect, useTransition } from 'react';
import {
  saveNewsletterItemAction,
  deleteNewsletterItemAction,
  getNewsletterItemsByWeek,
  getNewsletterQueue,
  resendEditionAction,
} from './actions';

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
  const off = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + off);
  return d.toISOString().split('T')[0];
}

function fmtWeek(ws: string) {
  const d   = new Date(ws);
  const end = new Date(d);
  end.setDate(d.getDate() + 6);
  const fmt = (x: Date) => x.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  return `${fmt(d)} – ${fmt(end)}`;
}

interface Item {
  id:         string;
  category:   string;
  title:      string;
  summary:    string | null;
  url:        string | null;
  week_start: string;
  status:     string;
  sent_at:    string | null;
}

interface Edition {
  week_start: string;
  status:     string;
  sent_at:    string | null;
  count:      number;
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'sent') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 text-green-700">
        ✓ Enviada
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700">
      ● Programada
    </span>
  );
}

export default function AdminNewsletterPage() {
  const [weekStart, setWeekStart]    = useState(getCurrentMonday());
  const [category,  setCategory]     = useState<string>('neurociencia');
  const [title,     setTitle]        = useState('');
  const [summary,   setSummary]      = useState('');
  const [url,       setUrl]          = useState('');
  const [items,     setItems]        = useState<Item[]>([]);
  const [queue,     setQueue]        = useState<Edition[]>([]);
  const [error,       setError]        = useState<string | null>(null);
  const [success,     setSuccess]      = useState(false);
  const [resendMsg,   setResendMsg]    = useState<string | null>(null);
  const [isPending,   startTransition] = useTransition();
  const [isResending, setIsResending]  = useState(false);

  useEffect(() => { loadAll() }, [weekStart]);

  async function loadAll() {
    try {
      const [itemsData, queueData] = await Promise.all([
        getNewsletterItemsByWeek(weekStart),
        getNewsletterQueue(),
      ]);
      setItems(itemsData as Item[]);
      setQueue(queueData as Edition[]);
    } catch { /* silencioso */ }
  }

  const selectedEditionStatus = queue.find(e => e.week_start === weekStart)?.status ?? null;
  const isSent = selectedEditionStatus === 'sent';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setSuccess(false);
    if (!title.trim()) { setError('El título es obligatorio.'); return; }
    if (isSent)        { setError('Esta edición ya fue enviada y no puede editarse.'); return; }

    startTransition(async () => {
      try {
        await saveNewsletterItemAction({
          week_start:   weekStart,
          category:     category as any,
          title:        title.trim(),
          summary:      summary.trim(),
          external_url: url.trim(),
        });
        setTitle(''); setSummary(''); setUrl('');
        setSuccess(true);
        await loadAll();
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) { setError(err.message ?? 'Error desconocido'); }
    });
  }

  async function handleResend() {
    if (!confirm(`¿Reenviar la edición del ${fmtWeek(weekStart)} a los suscriptores que aún no la recibieron?`)) return;
    setIsResending(true);
    setResendMsg(null);
    try {
      const result = await resendEditionAction(weekStart);
      setResendMsg(result.message ?? `✓ ${result.sent} enviados, ${result.errors} errores`);
    } catch (err: any) {
      setResendMsg(`Error: ${err.message}`);
    } finally {
      setIsResending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este item?')) return;
    startTransition(async () => {
      try { await deleteNewsletterItemAction(id); await loadAll(); }
      catch (err: any) { setError(err.message ?? 'Error al eliminar'); }
    });
  }

  return (
    <div className="space-y-10">

      {/* ── COLA ── */}
      <div>
        <h2 className="text-xl font-serif font-bold text-aubergine-dark mb-4">Cola de envíos</h2>
        {queue.length === 0 ? (
          <p className="text-sm text-aubergine-dark/40 italic">No hay ediciones en cola.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {queue.map((edition, i) => {
              const isNext = edition.status === 'scheduled' && queue.filter(e => e.status === 'scheduled').indexOf(edition) === 0;
              return (
                <button
                  key={edition.week_start}
                  onClick={() => setWeekStart(edition.week_start)}
                  className={`flex flex-col gap-1 px-4 py-3 rounded-xl border text-left transition-all ${
                    edition.week_start === weekStart
                      ? 'border-[#6B2737] bg-[#6B2737]/5'
                      : 'border-aubergine-dark/10 bg-white hover:border-aubergine-dark/25'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isNext && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#FF6B35]">Próxima →</span>
                    )}
                    <StatusBadge status={edition.status} />
                  </div>
                  <span className="text-sm font-semibold text-aubergine-dark">{fmtWeek(edition.week_start)}</span>
                  <span className="text-xs text-aubergine-dark/40">{edition.count} ítem{edition.count !== 1 ? 's' : ''}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Selector de semana ── */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-semibold text-aubergine-dark">Semana del lunes:</label>
        <input
          type="date"
          value={weekStart}
          onChange={e => setWeekStart(e.target.value)}
          className="border border-aubergine-dark/20 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        {selectedEditionStatus && <StatusBadge status={selectedEditionStatus} />}
      </div>

      {/* ── Formulario ── */}
      {isSent ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-sm text-green-800 space-y-3">
          <p>
            Esta edición ya fue enviada el{' '}
            {queue.find(e => e.week_start === weekStart)?.sent_at
              ? new Date(queue.find(e => e.week_start === weekStart)!.sent_at!).toLocaleString('es-ES')
              : '—'}
            . No puede modificarse.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="px-4 py-2 rounded-full text-xs font-bold border border-green-600 text-green-800 hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              {isResending ? 'Reenviando…' : '↩ Reenviar a nuevos suscriptores'}
            </button>
            {resendMsg && (
              <span className="text-xs font-medium">{resendMsg}</span>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-aubergine-dark/8 shadow-sm space-y-6">
          <h2 className="text-xl font-serif font-bold text-aubergine-dark">Añadir ítem</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">Categoría *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-aubergine-dark/20 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">URL externa</label>
              <input
                type="url" value={url} onChange={e => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full border border-aubergine-dark/20 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">Título *</label>
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)} required
              placeholder="Un nuevo estudio sobre el eje intestino-cerebro..."
              className="w-full border border-aubergine-dark/20 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-aubergine-dark/50 mb-1.5">Resumen</label>
            <textarea
              value={summary} onChange={e => setSummary(e.target.value)} rows={3}
              placeholder="Breve descripción del contenido..."
              className="w-full border border-aubergine-dark/20 rounded-lg px-3 py-2.5 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>

          {error   && <p className="text-sm text-red-600 font-medium">{error}</p>}
          {success && <p className="text-sm text-green-700 font-medium">✓ Ítem guardado.</p>}

          <button
            type="submit" disabled={isPending}
            className="px-6 py-3 rounded-full bg-[#6B2737] text-white text-sm font-bold hover:bg-[#5a2030] transition-colors disabled:opacity-50"
          >
            {isPending ? 'Guardando…' : '+ Añadir ítem'}
          </button>
        </form>
      )}

      {/* ── Ítems de la semana ── */}
      <div>
        <h2 className="text-xl font-serif font-bold text-aubergine-dark mb-6">
          Edición semana {fmtWeek(weekStart)}
          <span className="ml-3 text-sm font-sans font-normal text-aubergine-dark/40">({items.length} ítems)</span>
        </h2>

        {items.length === 0 ? (
          <p className="text-sm text-aubergine-dark/40 italic">No hay ítems para esta semana.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-5 border border-aubergine-dark/8 shadow-sm flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B2737]">
                      {CATEGORIES.find(c => c.value === item.category)?.label ?? item.category}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  {item.status !== 'sent' && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 transition-colors shrink-0"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
                <p className="font-serif text-sm font-semibold text-aubergine-dark leading-snug">{item.title}</p>
                {item.summary && (
                  <p className="text-xs text-aubergine-dark/55 font-light leading-relaxed">{item.summary}</p>
                )}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#6B2737] hover:underline truncate">
                    {item.url}
                  </a>
                )}
                {item.sent_at && (
                  <p className="text-[10px] text-aubergine-dark/30">
                    Enviada: {new Date(item.sent_at).toLocaleString('es-ES')}
  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
