import { useEffect, useState } from 'react';
import { api, BASE_URL } from '../api';
import { getUser, isAdmin } from '../auth';
import Shell from '../components/Shell';

const resources = [
  { key: 'cars', label: 'Carros', path: '/cars' },
  { key: 'motos', label: 'Motos', path: '/motos' },
  { key: 'clothing-brands', label: 'Marcas de roupa', path: '/clothing-brands' },
];

export default function Dashboard() {
  const user = getUser();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const entries = await Promise.all(
        resources.map(async (resource) => {
          try {
            const data = await api.list(resource.key);
            return [resource.key, Array.isArray(data) ? data.length : 0];
          } catch {
            return [resource.key, 0];
          }
        })
      );

      if (isAdmin()) {
        try {
          const users = await api.list('users');
          entries.push(['users', Array.isArray(users) ? users.length : 0]);
        } catch {
          entries.push(['users', 0]);
        }
      }

      setCounts(Object.fromEntries(entries));
      setLoading(false);
    }

    load();
  }, []);

  return (
    <Shell
      eyebrow="Resumo"
      title="Dashboard"
      description="Acompanhe os recursos cadastrados e acesse as telas de CRUD integradas ao backend."
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource) => (
          <a key={resource.key} href={resource.path} className="rounded-lg border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
            <p className="text-sm font-semibold text-muted">{resource.label}</p>
            <p className="mt-3 text-4xl font-extrabold text-ink">{loading ? '-' : counts[resource.key] ?? 0}</p>
          </a>
        ))}
        {isAdmin() && (
          <a href="/users" className="rounded-lg border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
            <p className="text-sm font-semibold text-muted">Usuarios</p>
            <p className="mt-3 text-4xl font-extrabold text-ink">{loading ? '-' : counts.users ?? 0}</p>
          </a>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-line bg-panel p-5">
        <h2 className="text-lg font-bold text-ink">Sessao atual</h2>
        <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-3">
          <p><strong className="text-ink">Usuario:</strong> {user?.name}</p>
          <p><strong className="text-ink">Perfil:</strong> {user?.role}</p>
          <p><strong className="text-ink">API:</strong> {BASE_URL}</p>
        </div>
      </section>
    </Shell>
  );
}
