import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Página não encontrada');

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl font-bold text-brand-blue-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">Página não encontrada</h1>
      <p className="mt-2 text-sm text-slate-400">A página que você procura não existe ou foi movida.</p>
      <Link to="/" className="btn-primary mt-8">
        Voltar para o início
      </Link>
    </div>
  );
}
