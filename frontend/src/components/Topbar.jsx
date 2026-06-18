import { ChevronRight, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUser } from '../auth';

export default function Topbar({ title, onMenu }) {
  const user = getUser();

  return (
    <header className="sticky top-0 z-30 flex h-[86px] w-full items-center gap-4 border-b border-white/70 bg-shell/92 px-6 backdrop-blur-xl lg:px-9">
      <button onClick={onMenu} className="icon-tile lg:hidden" aria-label="Abrir menu">
        <Menu size={19} />
      </button>

      <div className="min-w-0 flex-1 md:hidden">
        <p className="truncate text-lg font-black text-ink">{title}</p>
      </div>

      <Link
        to="/settings"
        className="ml-auto flex h-12 items-center gap-3 rounded-[18px] bg-white/78 px-3 shadow-card ring-1 ring-line/70 transition hover:-translate-y-0.5 hover:bg-white"
        aria-label="Abrir configuracoes do perfil"
      >
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-slate-900 to-slate-600 text-sm font-black text-white">
          {(user?.name || 'U').slice(0, 1).toUpperCase()}
        </div>
        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-black text-ink">{user?.name || 'Usuario'}</p>
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{user?.role || 'USER'}</p>
        </div>
        <ChevronRight size={17} className="text-muted" />
      </Link>
    </header>
  );
}
