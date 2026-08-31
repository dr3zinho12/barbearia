import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { brand } from '../config/brand';
import { useAuth } from '../contexts/AuthContext';

const PUBLIC_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/barbeiros', label: 'Barbeiros' },
  { to: '/planos', label: 'Planos' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  }

  const dashboardPath = user?.role === 'ADMIN' ? '/admin' : '/cliente';

  return (
    <header className="sticky top-0 z-40 border-b border-brand-border/80 bg-brand-black/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-500 font-display text-lg font-bold text-white shadow-glow">
            B
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">{brand.name}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {PUBLIC_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-brand-blue-400' : 'text-slate-300 hover:text-white'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to={dashboardPath} className="btn-secondary">
                Minha área
              </Link>
              <button type="button" onClick={handleLogout} className="btn-ghost">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Entrar
              </Link>
              <Link to="/cadastro" className="btn-primary">
                Agendar horário
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border text-slate-200 md:hidden"
          aria-label="Abrir menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
            {isMenuOpen ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-brand-border bg-brand-black px-4 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {PUBLIC_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-white/5 text-brand-blue-400' : 'text-slate-300 hover:bg-white/5'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={dashboardPath} className="btn-secondary w-full" onClick={() => setIsMenuOpen(false)}>
                  Minha área
                </Link>
                <button type="button" onClick={handleLogout} className="btn-ghost w-full">
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary w-full" onClick={() => setIsMenuOpen(false)}>
                  Entrar
                </Link>
                <Link to="/cadastro" className="btn-primary w-full" onClick={() => setIsMenuOpen(false)}>
                  Agendar horário
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
