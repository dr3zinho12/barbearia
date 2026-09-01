import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { brand } from '../config/brand';
import { useAuth } from '../contexts/AuthContext';

export function SidebarShell({ title, navItems }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="flex min-h-screen bg-brand-black">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-brand-border bg-brand-night transition-transform duration-200 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link to="/" className="flex items-center gap-2 border-b border-brand-border px-6 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-500 font-display text-lg font-bold text-white">
            R
          </span>
          <span className="font-display text-base font-bold text-white">{brand.name}</span>
        </Link>

        <p className="px-6 pt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-blue-500/15 text-brand-blue-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="h-5 w-5">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-brand-border p-4">
          <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
          <button type="button" onClick={handleLogout} className="btn-secondary mt-3 w-full">
            Sair da conta
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:pl-0">
        <header className="flex items-center justify-between border-b border-brand-border bg-brand-black/90 px-4 py-4 backdrop-blur lg:hidden">
          <button
            type="button"
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border text-slate-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-display text-sm font-bold text-white">{title}</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
