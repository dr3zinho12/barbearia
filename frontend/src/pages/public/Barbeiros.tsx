import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { barbersService } from '../../services/barbers.service';
import { Barber } from '../../types';

export default function Barbeiros() {
  useDocumentTitle('Barbeiros');
  const [barbers, setBarbers] = useState<Barber[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    barbersService
      .list()
      .then(setBarbers)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-title">Nossos barbeiros</h1>
        <p className="section-subtitle mx-auto">
          Uma equipe experiente e apaixonada por transformar visuais.
        </p>
      </div>

      {barbers === null && !error && (
        <div className="mt-16 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="mt-16">
          <EmptyState title="Não foi possível carregar os barbeiros" description="Verifique sua conexão e tente novamente." />
        </div>
      )}

      {barbers?.length === 0 && (
        <div className="mt-16">
          <EmptyState title="Nenhum barbeiro cadastrado" description="Em breve nossa equipe estará disponível." />
        </div>
      )}

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {barbers?.map((barber) => (
          <div key={barber.id} className="card flex flex-col items-center p-8 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue-500/15 text-3xl font-bold text-brand-blue-300">
              {barber.name.charAt(0)}
            </div>
            <h3 className="mt-5 text-xl font-semibold text-white">{barber.name}</h3>
            <p className="mt-2 text-sm text-slate-400">{barber.description}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {barber.specialties.map((specialty) => (
                <span key={specialty} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {barbers && barbers.length > 0 && (
        <div className="mt-14 text-center">
          <Link to="/cadastro" className="btn-primary px-8 py-3 text-base">
            Agendar horário
          </Link>
        </div>
      )}
    </div>
  );
}
