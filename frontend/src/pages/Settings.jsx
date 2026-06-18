import {
  Camera,
  CheckCircle2,
  CircleDot,
  Database,
  Globe2,
  LogOut,
  MonitorCog,
  Save,
  Server,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api';
import { clearToken, getToken, getUser, isAdmin, saveSession } from '../auth';
import Alert from '../components/Alert';
import Shell from '../components/Shell';

const AVATAR_KEY = 'atlas.avatar';

const tabs = [
  { id: 'profile', label: 'Perfil', icon: UserRound },
  { id: 'security', label: 'Seguranca', icon: ShieldCheck },
  { id: 'system', label: 'Sistema', icon: Server },
];

function getAvatarKey(user) {
  return `${AVATAR_KEY}.${user?.id || user?.email || 'default'}`;
}

function getStoredAvatar(user) {
  return localStorage.getItem(getAvatarKey(user)) || localStorage.getItem(AVATAR_KEY) || '';
}

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const user = getUser() || {};
  const admin = isAdmin();
  const frontendUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';

  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: user.name || 'Usuario',
    email: user.email || '',
    role: user.role || 'USER',
  });
  const [avatar, setAvatar] = useState('');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setAvatar(getStoredAvatar(user));
  }, [user.id, user.email]);

  const initial = useMemo(() => (profile.name || 'U').slice(0, 1).toUpperCase(), [profile.name]);

  function logout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  function saveProfile(event) {
    event.preventDefault();
    const token = getToken();
    const updatedUser = {
      ...user,
      name: profile.name.trim() || user.name || 'Usuario',
      email: profile.email.trim(),
      role: user.role || profile.role || 'USER',
    };

    if (token) {
      saveSession(token, updatedUser);
    } else {
      localStorage.setItem('atlas.user', JSON.stringify(updatedUser));
    }

    setProfile({ name: updatedUser.name, email: updatedUser.email || '', role: updatedUser.role });
    setToast({ type: 'success', message: 'Alteracoes do perfil salvas localmente.' });
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      localStorage.setItem(getAvatarKey(user), result);
      setAvatar(result);
      setToast({ type: 'success', message: 'Foto de perfil atualizada.' });
      event.target.value = '';
    };
    reader.readAsDataURL(file);
  }

  function updatePassword(event) {
    event.preventDefault();

    if (passwords.next.length < 6) {
      setToast({ type: 'error', message: 'A nova senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setToast({ type: 'error', message: 'A confirmacao precisa ser igual a nova senha.' });
      return;
    }

    setPasswords({ current: '', next: '', confirm: '' });
    setToast({ type: 'success', message: 'Senha validada. Nao ha endpoint de troca, entao nada foi enviado ao backend.' });
  }

  return (
    <Shell eyebrow="Minha conta / Perfil" title="Configuracoes da conta" description="Gerencie perfil, seguranca e dados do sistema.">
      <div className="w-full">
        <section className="min-h-[calc(100vh-210px)] w-full overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-card ring-1 ring-line/70">
          <div className="relative border-b border-line/70 bg-[linear-gradient(90deg,#ffffff_0,#f7fbfc_50%,#ffffff_100%)] px-6 py-8 sm:px-9 lg:px-10">
            <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'linear-gradient(#edf3f5 1px, transparent 1px), linear-gradient(90deg, #edf3f5 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-teal-600 shadow-card ring-4 ring-white">
                  {avatar ? (
                    <img src={avatar} alt="Foto de perfil" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-950 to-slate-600 text-5xl font-black text-white">
                      {initial}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-3xl font-black tracking-tight text-ink">{profile.name || 'Usuario'}</h2>
                    <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-blue-500 text-white">
                      <CheckCircle2 size={15} />
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-muted">{profile.email || 'E-mail nao informado'}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      {admin ? 'ADMIN' : 'USER'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-1 text-xs font-black text-emerald-700">
                      <CircleDot size={12} />
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-soft">
                  <Camera size={17} />
                  Alterar foto
                </button>
                <button type="button" onClick={logout} className="btn-danger">
                  <LogOut size={17} />
                  Encerrar sessao
                </button>
              </div>
            </div>
          </div>

          <div className="grid min-h-[calc(100vh-405px)] lg:grid-cols-[300px_minmax(0,1fr)]">
            <aside className="border-b border-line/70 bg-slate-50/60 p-4 lg:border-b-0 lg:border-r lg:p-5">
              <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex min-w-max items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition lg:min-w-0 ${
                        active ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-500 hover:bg-white hover:text-slate-950'
                      }`}
                    >
                      <Icon size={19} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            <main className="min-w-0 p-5 sm:p-7 lg:p-8 xl:p-10">
              {activeTab === 'profile' && (
                <ProfilePanel profile={profile} setProfile={setProfile} onSubmit={saveProfile} />
              )}
              {activeTab === 'security' && (
                <SecurityPanel passwords={passwords} setPasswords={setPasswords} onSubmit={updatePassword} onLogout={logout} />
              )}
              {activeTab === 'system' && (
                <SystemPanel baseUrl={BASE_URL} frontendUrl={frontendUrl} />
              )}
            </main>
          </div>
        </section>
      </div>

      <Alert toast={toast} onDone={() => setToast(null)} />
    </Shell>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div className="mb-6 max-w-4xl">
      <h3 className="text-xl font-black text-ink">{title}</h3>
      <p className="mt-1 text-sm font-semibold text-muted">{description}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-3 border-b border-dashed border-line/90 py-4 md:grid-cols-[240px_minmax(0,1fr)] md:items-center xl:grid-cols-[280px_minmax(0,1fr)]">
      <span className="text-sm font-bold text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink outline-none transition placeholder:text-muted focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5 ${props.className || ''}`}
    />
  );
}

function ProfilePanel({ profile, setProfile, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <SectionTitle title="Perfil" description="Atualize seus dados basicos. As alteracoes sao salvas localmente nesta versao." />
      <div className="min-h-[230px] rounded-[24px] border border-line/80 bg-white px-5 shadow-card xl:px-6">
        <Field label="Nome">
          <Input value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} required />
        </Field>
        <Field label="E-mail">
          <Input type="email" value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} />
        </Field>
        <Field label="Perfil">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700">{profile.role}</span>
            <span className="text-xs font-semibold text-muted">O perfil vem da autenticacao da API.</span>
          </div>
        </Field>
      </div>
      <div className="mt-5 flex justify-end">
        <button type="submit" className="btn-primary">
          <Save size={17} />
          Salvar alteracoes
        </button>
      </div>
    </form>
  );
}

function SecurityPanel({ passwords, setPasswords, onSubmit, onLogout }) {
  return (
    <form onSubmit={onSubmit}>
      <SectionTitle title="Seguranca" description="Valide uma nova senha e gerencie sua sessao atual." />
      <div className="min-h-[300px] rounded-[24px] border border-line/80 bg-white px-5 shadow-card xl:px-6">
        <Field label="Senha atual">
          <Input type="password" value={passwords.current} onChange={(event) => setPasswords((current) => ({ ...current, current: event.target.value }))} placeholder="Digite a senha atual" />
        </Field>
        <Field label="Nova senha">
          <Input type="password" minLength={6} value={passwords.next} onChange={(event) => setPasswords((current) => ({ ...current, next: event.target.value }))} placeholder="Minimo de 6 caracteres" />
        </Field>
        <Field label="Confirmar nova senha">
          <Input type="password" value={passwords.confirm} onChange={(event) => setPasswords((current) => ({ ...current, confirm: event.target.value }))} placeholder="Repita a nova senha" />
        </Field>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={onLogout} className="btn-danger">
          <LogOut size={17} />
          Encerrar sessao
        </button>
        <button type="submit" className="btn-primary">
          <ShieldCheck size={17} />
          Alterar senha
        </button>
      </div>
    </form>
  );
}

function SystemPanel({ baseUrl, frontendUrl }) {
  return (
    <div>
      <SectionTitle title="Sistema" description="Informacoes de infraestrutura usadas pela aplicacao." />
      <div className="min-h-[360px] rounded-[24px] border border-line/80 bg-white px-5 shadow-card xl:px-6">
        <InfoRow icon={Server} label="API" value={baseUrl} />
        <InfoRow icon={MonitorCog} label="Frontend" value={frontendUrl} />
        <InfoRow icon={Database} label="MongoDB" value="Banco NoSQL para carros, motos e marcas" />
        <InfoRow icon={Database} label="PostgreSQL" value="Banco SQL para usuarios" />
        <InfoRow icon={Globe2} label="Docker Compose" value="api, frontend, mongo e postgres" />
        <InfoRow icon={Server} label="Swagger" value={`${baseUrl}/docs`} />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="grid gap-3 border-b border-dashed border-line/90 py-4 last:border-0 md:grid-cols-[240px_minmax(0,1fr)] md:items-center xl:grid-cols-[280px_minmax(0,1fr)]">
      <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">
        <Icon size={17} />
        {label}
      </span>
      <span className="break-all text-sm font-black text-ink">{value}</span>
    </div>
  );
}
