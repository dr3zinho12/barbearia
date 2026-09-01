import { Link } from 'react-router-dom';
import { brand } from '../config/brand';

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-night">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-blue-500 font-display text-base font-bold text-white">
                B
              </span>
              <span className="font-display text-base font-bold text-white">{brand.name}</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-400">{brand.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="mb-3 font-semibold text-white">Navegação</p>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/servicos" className="hover:text-brand-blue-400">Serviços</Link></li>
                <li><Link to="/barbeiros" className="hover:text-brand-blue-400">Barbeiros</Link></li>
                <li><Link to="/planos" className="hover:text-brand-blue-400">Planos</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-white">Conta</p>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/login" className="hover:text-brand-blue-400">Entrar</Link></li>
                <li><Link to="/cadastro" className="hover:text-brand-blue-400">Criar conta</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-10 border-t border-brand-border pt-6 text-xs text-slate-500">
          © {new Date().getFullYear()} {brand.name}. Projeto acadêmico de TCC — todos os dados são fictícios.
        </p>
      </div>
    </footer>
  );
}
