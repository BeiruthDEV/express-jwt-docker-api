import { Boxes, Car, CheckCircle2, Gauge, LockKeyhole, Mail, Shirt, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { isAuthenticated, saveSession } from '../auth';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

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
    <main className="h-screen overflow-hidden bg-[#EEF7FA] p-0">
      <div className="grid h-screen overflow-hidden bg-white lg:grid-cols-[55fr_45fr]">
        <PreviewPanel />

        <section className="flex h-screen items-center justify-center overflow-hidden bg-[#F8FBFC] px-5 py-4 lg:px-10 xl:px-14">
          <div className="w-full max-w-[440px] animate-rise">
            <div className="mb-5 lg:hidden">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm">
                  <Boxes size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-ink">Inventory Control</h1>
                  <p className="text-xs font-bold text-muted">Admin Panel</p>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/80 bg-white p-5 shadow-card ring-1 ring-line/70 sm:p-6">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-brandDark">Acesso seguro</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-ink">
                {mode === 'login' ? 'Entrar no painel' : 'Criar acesso'}
              </h2>
              <p className="mt-1.5 text-sm font-semibold leading-6 text-muted">
                {mode === 'login'
                  ? 'Acesse sua conta para gerenciar os cadastros.'
                  : 'Crie uma conta para acessar o painel.'}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-full bg-slate-100 p-1.5">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`rounded-full px-4 py-2.5 text-sm font-black transition ${
                    mode === 'login' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`rounded-full px-4 py-2.5 text-sm font-black transition ${
                    mode === 'register' ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  Cadastro
                </button>
              </div>

              <form onSubmit={submit} className="mt-5 space-y-4">
                {mode === 'register' && (
                  <Field icon={UserRound} label="Nome">
                    <input
                      className="auth-input"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Seu nome"
                      required
                    />
                  </Field>
                )}

                <Field icon={Mail} label="E-mail">
                  <input
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </Field>

                <Field icon={LockKeyhole} label="Senha">
                  <input
                    className="auth-input"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Digite sua senha"
                    minLength={6}
                    required
                  />
                </Field>

                {mode === 'login' && (
                  <div className="-mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setForgotOpen(true)}
                      className="text-xs font-extrabold uppercase tracking-[0.18em] text-brandDark transition hover:text-ink"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                )}

                {message && (
                  <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    message.type === 'error'
                      ? 'border-rose-100 bg-rose-50 text-rose-700'
                      : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
                </button>
              </form>
            </div>

            <p className="mt-3 text-center text-xs font-semibold text-muted">
              Autenticacao via JWT e rotas protegidas por token Bearer.
            </p>
          </div>
        </section>
      </div>

      <ForgotPasswordModal
        open={forgotOpen}
        defaultEmail={email}
        onClose={() => setForgotOpen(false)}
      />
    </main>
  );
}

function PreviewPanel() {
  return (
    <section className="relative hidden h-screen overflow-hidden bg-slate-950 px-8 py-7 text-white lg:flex lg:flex-col lg:justify-between xl:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(20,184,166,0.26),transparent_28%),radial-gradient(circle_at_88%_30%,rgba(56,189,248,0.16),transparent_26%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#0f766e_130%)]" />
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '42px 42px' }} />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-950 shadow-sm">
            <Boxes size={25} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight">Inventory Control</p>
            <p className="text-xs font-bold text-white/50">Admin Panel</p>
          </div>
        </div>

        <div className="mt-8 max-w-2xl">
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight xl:text-5xl">
            Controle seu inventario em uma interface integrada.
          </h1>
          <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/68">
            Gerencie carros, motos, marcas de roupa e usuarios com autenticacao JWT e dados reais do backend.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['React', 'Tailwind', 'Docker', 'JWT'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black text-white/82 backdrop-blur">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <DashboardPreview />
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="relative z-10 mt-6">
      <div className="relative mx-auto max-w-[640px] rounded-[28px] border border-white/16 bg-white/12 p-3 shadow-2xl backdrop-blur-xl">
        <div className="rounded-[22px] bg-[#F5FAFB] p-3 text-slate-950 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-9 w-52 rounded-full border border-slate-200 bg-white" />
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-2xl bg-white ring-1 ring-slate-200" />
              <span className="h-9 w-9 rounded-2xl bg-slate-950" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <MiniMetric icon={Car} label="Carros" value="8" tone="emerald" />
            <MiniMetric icon={Gauge} label="Motos" value="8" tone="sky" />
            <MiniMetric icon={Shirt} label="Marcas" value="7" tone="orange" />
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_190px]">
            <div className="rounded-[20px] border border-slate-200 bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black">Recursos cadastrados</p>
                  <p className="text-[11px] font-bold text-slate-500">Resumo do catalogo</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">Online</span>
              </div>
              <div className="flex h-20 items-end gap-2 border-l border-dashed border-slate-200 pl-3">
                {[36, 52, 44, 70, 58, 82, 64, 76].map((height, index) => (
                  <div key={index} className="flex h-full flex-1 items-end gap-1">
                    <span className="w-1/2 rounded-t-full bg-cyan-200" style={{ height: `${height}%` }} />
                    <span className="w-1/2 rounded-t-full bg-teal-500" style={{ height: `${Math.max(20, height - 18)}%` }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-slate-200 bg-white p-3">
              <p className="text-sm font-black">Status</p>
              <div className="mt-4 grid place-items-center">
                <div className="grid h-20 w-20 place-items-center rounded-full" style={{ background: 'conic-gradient(#14B8A6 0 44%, #67E8F9 44% 76%, #F59E0B 76% 100%)' }}>
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-white text-center shadow-sm">
                    <div>
                      <p className="text-lg font-black">23</p>
                      <p className="text-[9px] font-black text-slate-500">ITENS</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-[20px] border border-slate-200 bg-white">
            {[
              ['Toyota Corolla', 'Carros'],
              ['Honda Civic', 'Carros'],
              ['BMW 320i', 'Carros'],
            ].map(([name, type], index) => (
              <div key={name} className="grid grid-cols-[1fr_auto_56px] items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-b-0">
                <div>
                  <p className="text-sm font-black">{name}</p>
                  <p className="text-[11px] font-bold text-slate-500">Sincronizado com API</p>
                </div>
                <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">Ativo</span>
                <span className="text-right text-xs font-black text-slate-400">#{String(index + 1).padStart(3, '0')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ icon: Icon, label, value, tone }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700',
    sky: 'bg-sky-50 text-sky-700',
    orange: 'bg-orange-50 text-orange-700',
  };

  return (
    <div className="rounded-[18px] border border-slate-200 bg-white p-2.5">
      <div className="flex items-center justify-between">
        <div className={`grid h-9 w-9 place-items-center rounded-2xl ${tones[tone]}`}>
          <Icon size={18} />
        </div>
        <CheckCircle2 size={16} className="text-emerald-500" />
      </div>
      <p className="mt-2 text-xl font-black">{value}</p>
      <p className="text-xs font-bold text-slate-500">{label}</p>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition focus-within:border-teal-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-100">
        <Icon size={18} className="shrink-0 text-slate-400" />
        {children}
      </div>
    </label>
  );
}
