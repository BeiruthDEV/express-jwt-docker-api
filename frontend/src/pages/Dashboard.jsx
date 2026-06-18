import { Car, Gauge, PackageCheck, Shirt, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { isAdmin } from '../auth';
import Badge from '../components/Badge';
import BrandLogo from '../components/BrandLogo';
import Shell from '../components/Shell';
import StatCard from '../components/StatCard';

const modules = [
  { key: 'cars', label: 'Carros', metric: 'Total de carros', icon: Car, tone: 'teal' },
  { key: 'motos', label: 'Motos', metric: 'Total de motos', icon: Gauge, tone: 'cyan' },
  { key: 'clothing-brands', label: 'Marcas', metric: 'Total de marcas', icon: Shirt, tone: 'amber' },
];

export default function Dashboard() {
  const admin = isAdmin();
  const [data, setData] = useState({ cars: [], motos: [], 'clothing-brands': [], users: [] });
  const [loading, setLoading] = useState(true);
  const [recentFilter, setRecentFilter] = useState('cars');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const entries = await Promise.all(
        modules.map(async (mod) => {
          try {
            const rows = await api.list(mod.key);
            return [mod.key, Array.isArray(rows) ? rows : []];
          } catch {
            return [mod.key, []];
          }
        })
      );

      if (admin) {
        try {
          const users = await api.list('users');
          entries.push(['users', Array.isArray(users) ? users : []]);
        } catch {
          entries.push(['users', []]);
        }
      }

      setData(Object.fromEntries(entries));
      setLoading(false);
    }

    load();
  }, [admin]);

  const counts = {
    cars: data.cars?.length || 0,
    motos: data.motos?.length || 0,
    brands: data['clothing-brands']?.length || 0,
    users: data.users?.length || 0,
  };
  const total = counts.cars + counts.motos + counts.brands;

  const recentByType = useMemo(() => {
    const cars = (data.cars || []).slice(-4).map((item) => ({
      filter: 'cars',
      type: 'Carros',
      title: `${item.brand} ${item.model}`,
      meta: `${item.year || '-'} / ${item.color || 'sem cor'}`,
      brand: item.brand,
      icon: Car,
      tone: 'teal',
    }));
    const motos = (data.motos || []).slice(-4).map((item) => ({
      filter: 'motos',
      type: 'Motos',
      title: `${item.brand} ${item.model}`,
      meta: `${item.year || '-'} / ${item.cc || '-'} cc`,
      brand: item.brand,
      icon: Gauge,
      tone: 'blue',
    }));
    const brands = (data['clothing-brands'] || []).slice(-4).map((item) => ({
      filter: 'brands',
      type: 'Marcas',
      title: item.name,
      meta: `${item.country || '-'} / ${item.foundedYear || '-'}`,
      brand: item.name,
      icon: Shirt,
      tone: 'amber',
    }));
    return { cars, motos, brands };
  }, [data]);
  const filteredRecent = recentByType[recentFilter] || [];

  const bars = [42, 52, 46, 63, 55, 70, 58, 76, 68, 82, 61, 74].map((value, index) => value + (total % 9) + index);
  const maxBar = Math.max(...bars);

  return (
    <Shell
      eyebrow="Catalogo geral"
      title="Dashboard"
      description="Recursos cadastrados, status da integracao e ultimos cadastros sincronizados com API."
    >
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total de carros" value={loading ? '-' : counts.cars} note="Sincronizado" icon={Car} tone="teal" change="+35%" />
        <StatCard title="Total de motos" value={loading ? '-' : counts.motos} note="Sincronizado" icon={Gauge} tone="cyan" change="+18%" />
        <StatCard title="Total de marcas" value={loading ? '-' : counts.brands} note="Sincronizado" icon={Shirt} tone="amber" change="+24%" />
        <StatCard title={admin ? 'Usuarios' : 'Total de itens'} value={loading ? '-' : admin ? counts.users : total} note={admin ? 'Acesso ADMIN' : 'Catalogo'} icon={admin ? Users : PackageCheck} tone="slate" trend="down" change="-5%" />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_356px]">
        <div className="panel-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
            <div>
              <h2 className="text-[17px] font-black text-ink">Recursos cadastrados</h2>
              <p className="mt-0.5 text-xs font-semibold text-muted">Catálogo geral por período</p>
            </div>
            <div className="flex items-center gap-5">
              <Legend color="bg-cyan-300" label="Cadastros" />
              <Legend color="bg-brand" label="Atualizados" />
              <button className="rounded-full border border-line bg-white px-3 py-2 text-xs font-black text-ink">Este ano</button>
            </div>
          </div>
          <div className="h-[246px] px-5 pb-5 pt-4">
            <div className="grid h-full grid-cols-[40px_1fr] gap-3">
              <div className="flex flex-col justify-between pb-8 pt-2 text-right text-[10px] font-bold text-muted">
                <span>100</span>
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>
              <div className="relative flex h-full items-end gap-3 border-l border-line/60 pl-4">
                <div className="pointer-events-none absolute inset-y-2 left-4 right-0 flex flex-col justify-between">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <span key={index} className="border-t border-dashed border-line/80" />
                  ))}
                </div>
                {bars.map((value, index) => {
                  const height = Math.round((value / maxBar) * 100);
                  return (
                    <div key={index} className="relative z-10 flex h-[190px] flex-1 flex-col justify-end">
                      <div className="mx-auto flex h-full w-full max-w-[30px] items-end gap-1">
                        <span className="block w-1/2 rounded-t-full bg-cyan-200" style={{ height: `${Math.max(20, height - 14)}%` }} />
                        <span className="block w-1/2 rounded-t-full bg-brand" style={{ height: `${Math.max(12, height - 30)}%` }} />
                      </div>
                      <span className="mt-2 text-center text-[10px] font-bold text-muted">{index % 2 === 0 ? `${index + 2}h` : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="panel-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
            <div>
              <h2 className="text-[17px] font-black text-ink">Status da integracao</h2>
              <p className="mt-0.5 text-xs font-semibold text-muted">Sincronizado com API</p>
            </div>
            <Badge tone="teal">Online</Badge>
          </div>
          <div className="p-5">
            <div className="mx-auto grid h-40 w-40 place-items-center rounded-full" style={{ background: donutBackground(counts, total) }}>
              <div className="grid h-[108px] w-[108px] place-items-center rounded-full bg-white shadow-card ring-1 ring-line/70">
                <div className="text-center">
                  <p className="text-2xl font-black text-ink">{total}</p>
                  <p className="text-[10px] font-black uppercase tracking-wide text-muted">Itens</p>
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <CategoryLine label="Carros" value={counts.cars} color="bg-brand" />
              <CategoryLine label="Motos" value={counts.motos} color="bg-cyan-300" />
              <CategoryLine label="Marcas" value={counts.brands} color="bg-amber-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="panel-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
            <div>
              <h2 className="text-[17px] font-black text-ink">Ultimos cadastros</h2>
              <p className="mt-0.5 text-xs font-semibold text-muted">Carros, motos e marcas recentes</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'cars', label: 'Carros' },
                { key: 'motos', label: 'Motos' },
                { key: 'brands', label: 'Marcas' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setRecentFilter(tab.key)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition ${
                    recentFilter === tab.key
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-line/70">
            {filteredRecent.length > 0 ? (
              filteredRecent.map((item, index) => (
                <RecentRow key={`${item.type}-${item.title}-${index}`} item={item} index={index} />
              ))
            ) : (
              <RecentEmptyState />
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}

function donutBackground(counts, total) {
  const safeTotal = total || 1;
  const car = Math.round((counts.cars / safeTotal) * 100);
  const moto = Math.round((counts.motos / safeTotal) * 100);
  return `conic-gradient(#14B8A6 0 ${car}%, #67E8F9 ${car}% ${car + moto}%, #FBBF24 ${car + moto}% 100%)`;
}

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-black text-muted">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function CategoryLine({ label, value, color }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5">
      <span className="inline-flex items-center gap-2 text-xs font-black text-muted">
        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
        {label}
      </span>
      <span className="text-sm font-black text-ink">{value}</span>
    </div>
  );
}

function RecentRow({ item, index }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_74px] items-center gap-3 px-5 py-4 transition hover:bg-slate-50">
      <div className="flex min-w-0 items-center gap-3">
        <BrandLogo name={item.brand} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{item.title}</p>
          <p className="truncate text-[11px] font-semibold text-muted">{item.meta}</p>
        </div>
      </div>
      <RecentTypeBadge type={item.filter}>{item.type}</RecentTypeBadge>
      <span className="text-right text-xs font-black text-slate-500">#{String(index + 1).padStart(3, '0')}</span>
    </div>
  );
}

function RecentTypeBadge({ type, children }) {
  const tones = {
    cars: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    motos: 'border-blue-100 bg-blue-50 text-blue-700',
    brands: 'border-orange-100 bg-orange-50 text-orange-700',
  };

  return (
    <span className={`min-w-[82px] rounded-full border px-3 py-1 text-center text-xs font-semibold ${tones[type] || tones.cars}`}>
      {children}
    </span>
  );
}

function RecentEmptyState() {
  return (
    <div className="px-5 py-10 text-center">
      <h3 className="text-sm font-black text-slate-950">Nenhum registro encontrado</h3>
      <p className="mt-1 text-sm font-semibold text-slate-500">Cadastre novos itens para visualizar esta categoria.</p>
    </div>
  );
}
