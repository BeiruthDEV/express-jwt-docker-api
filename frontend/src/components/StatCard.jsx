import { MoreVertical, TrendingDown, TrendingUp } from 'lucide-react';

export default function StatCard({ title, value, note, icon: Icon, tone = 'teal', trend = 'up', change = '+35%' }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-700',
    cyan: 'bg-cyan-50 text-cyan-700',
    amber: 'bg-orange-50 text-orange-700',
    slate: 'bg-slate-100 text-slate-700',
  };
  const TrendIcon = trend === 'down' ? TrendingDown : TrendingUp;

  return (
    <div className="panel-card h-[112px] px-4 py-3.5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <div className={`grid h-10 w-10 place-items-center rounded-2xl ${tones[tone] || tones.teal}`}>
              <Icon size={19} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[12px] font-bold text-muted">{title}</p>
            <p className="mt-1 text-xl font-black tracking-tight text-ink">{value}</p>
          </div>
        </div>
        <button className="grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-700" aria-label="Mais opcoes">
          <MoreVertical size={15} />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black ${trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
          <TrendIcon size={12} />
          {change}
        </span>
        {note && <p className="truncate text-[11px] font-bold text-muted">{note}</p>}
      </div>
    </div>
  );
}
