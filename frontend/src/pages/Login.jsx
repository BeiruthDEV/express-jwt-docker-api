import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, BASE_URL } from '../api';
import { isAuthenticated, saveSession } from '../auth';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) return <Navigate to="/" replace />;

  async function submit(event) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        await api.register({ name, email, password });
        setMode('login');
        setMessage({ type: 'success', text: 'Cadastro criado. Entre com seu e-mail e senha.' });
      } else {
        const data = await api.login(email, password);
        saveSession(data.token, data.user);
        navigate('/', { replace: true });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-canvas lg:grid-cols-2">
      <section className="hidden bg-ink px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/60">Inventory Control</p>
          <h1 className="mt-8 max-w-xl text-5xl font-extrabold leading-tight tracking-tight">
            Painel web para consumir a API da atividade.
          </h1>
          <p className="mt-5 max-w-lg text-white/70">
            Login com JWT, rotas protegidas e CRUDs integrados com MongoDB e PostgreSQL.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm text-white/70">
          <span>React</span>
          <span>Tailwind</span>
          <span>Docker</span>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl border border-line bg-panel p-6 shadow-soft sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wide text-brand">Acesso</p>
            <h2 className="mt-2 text-3xl font-extrabold text-ink">{mode === 'login' ? 'Entrar no painel' : 'Criar conta'}</h2>
            <p className="mt-2 text-sm text-muted">API configurada em {BASE_URL}</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-canvas p-1">
            <button type="button" onClick={() => setMode('login')} className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-panel shadow-sm' : 'text-muted'}`}>
              Login
            </button>
            <button type="button" onClick={() => setMode('register')} className={`rounded-md px-3 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-panel shadow-sm' : 'text-muted'}`}>
              Cadastro
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="label mb-2 block">Nome</label>
                <input className="input" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
            )}
            <div>
              <label className="label mb-2 block">E-mail</label>
              <input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div>
              <label className="label mb-2 block">Senha</label>
              <input className="input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
            </div>

            {message && (
              <div className={`rounded-md border px-3 py-2 text-sm ${message.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-brand'}`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
