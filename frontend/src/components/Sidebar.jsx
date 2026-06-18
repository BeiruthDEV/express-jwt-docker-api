import { Car, ChevronRight, Gauge, LayoutDashboard, LogOut, PanelLeft, PanelLeftClose, Settings, Shirt, Users, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearToken, isAdmin } from '../auth';

const baseLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/cars', label: 'Carros', icon: Car },
  { to: '/motos', label: 'Motos', icon: Gauge },
  { to: '/clothing-brands', label: 'Marcas', icon: Shirt },
];

export default function Sidebar({ open, onClose, collapsed, onToggleCollapsed }) {
  const navigate = useNavigate();
  const links = isAdmin() ? [...baseLinks, { to: '/users', label: 'Usuarios', icon: Users }] : baseLinks;

  function logout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  const widthClass = collapsed ? 'w-[80px]' : 'w-[286px]';
  const paddingClass = collapsed ? 'px-3 py-7' : 'px-6 py-7';

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 h-screen border-r border-white/70 bg-sidebar text-ink transition-all duration-300 lg:translate-x-0 ${widthClass} ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`flex h-full flex-col ${paddingClass}`}>
          <div className={`mb-10 flex items-center ${collapsed ? 'flex-col gap-3' : 'justify-between'}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-[18px] bg-white shadow-sm ring-1 ring-line/70">
                <img src="/icon.png" alt="Inventory Control" className="h-full w-full object-contain p-1" />
              </div>
              {!collapsed && (
                <div>
                  <p className="text-[19px] font-black tracking-tight">Inventory</p>
                  <p className="-mt-0.5 text-xs font-bold text-muted">Control</p>
                </div>
              )}
            </div>
            <button
              onClick={onToggleCollapsed}
              className="hidden h-10 w-10 place-items-center rounded-2xl border border-line bg-white text-muted transition hover:text-ink lg:grid"
              aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
              title={collapsed ? 'Expandir menu' : 'Recolher menu'}
            >
              {collapsed ? <PanelLeft size={19} /> : <PanelLeftClose size={19} />}
            </button>
            <button
              className="grid h-10 w-10 place-items-center rounded-2xl border border-line bg-white text-muted lg:hidden"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex h-14 items-center gap-3 rounded-[18px] text-[15px] font-bold transition ${
                      collapsed ? 'justify-center px-0' : 'px-4'
                    } ${isActive ? 'bg-ink text-white shadow-card' : 'text-muted hover:bg-white hover:text-ink'}`
                  }
                  title={collapsed ? link.label : undefined}
                >
                  <Icon size={21} strokeWidth={1.9} />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{link.label}</span>
                      <ChevronRight size={17} className="opacity-55" />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex h-12 items-center gap-3 rounded-[18px] text-sm font-bold transition ${
                  collapsed ? 'justify-center px-0' : 'px-4'
                } ${isActive ? 'bg-ink text-white shadow-card' : 'text-muted hover:bg-white hover:text-ink'}`
              }
              title={collapsed ? 'Settings' : undefined}
            >
              <Settings size={20} />
              {!collapsed && (
                <>
                  <span className="flex-1">Settings</span>
                  <ChevronRight size={16} className="opacity-45" />
                </>
              )}
            </NavLink>

            {!collapsed && (
              <div className="rounded-[22px] bg-white p-4 shadow-card ring-1 ring-line/80">
                <p className="text-xs font-black uppercase tracking-wide text-ink">API Online</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-muted">Dados reais sincronizados com JWT.</p>
              </div>
            )}

            <button
              onClick={logout}
              className={`flex h-12 w-full items-center gap-3 rounded-[18px] text-sm font-bold text-muted transition hover:bg-white hover:text-ink ${
                collapsed ? 'justify-center px-0' : 'px-4'
              }`}
              title={collapsed ? 'Logout' : undefined}
            >
              <LogOut size={20} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
