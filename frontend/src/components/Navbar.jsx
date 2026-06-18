import { NavLink, useNavigate } from 'react-router-dom';
import { clearToken, getUser, isAdmin } from '../auth';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/cars', label: 'Carros' },
  { to: '/motos', label: 'Motos' },
  { to: '/clothing-brands', label: 'Marcas' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const admin = isAdmin();

  function logout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-panel/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
        <NavLink to="/" className="mr-auto">
          <span className="text-lg font-extrabold tracking-tight text-ink">Inventory Control</span>
          <span className="ml-2 rounded-full bg-brand/10 px-2 py-1 text-xs font-bold text-brand">API</span>
        </NavLink>

        <nav className="order-3 flex w-full gap-2 overflow-x-auto sm:order-none sm:w-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-brand text-white' : 'text-muted hover:bg-canvas hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {admin && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-brand text-white' : 'text-muted hover:bg-canvas hover:text-ink'
                }`
              }
            >
              Usuarios
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:ml-0">
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-sm font-semibold text-ink">{user?.name || 'Usuario'}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-muted">{user?.role || 'USER'}</p>
          </div>
          <button type="button" onClick={logout} className="btn-ghost">
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
