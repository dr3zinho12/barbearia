import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { servicesService } from '../../services/services.service';
import { Service } from '../../types';
import { formatCurrency, formatDuration } from '../../utils/format';

export default function Servicos() {
  useDocumentTitle('Serviços');
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    servicesService
      .list()
      .then(setServices)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-title">Nossos serviços</h1>
        <p className="section-subtitle mx-auto">
          Escolha o serviço ideal para você. Todos os preços e durações são gerenciados pela nossa equipe.
        </p>
      </div>

      {services === null && !error && (
        <div className="mt-16 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="mt-16">
          <EmptyState title="Não foi possível carregar os serviços" description="Verifique sua conexão e tente novamente." />
        </div>
      )}

      {services?.length === 0 && (
        <div className="mt-16">
          <EmptyState title="Nenhum serviço disponível" description="Volte em breve para conferir nossos serviços." />
        </div>
      )}

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services?.map((service) => (
          <div key={service.id} className="card flex flex-col p-6 transition hover:border-brand-blue-500/50">
            <h3 className="text-xl font-semibold text-white">{service.name}</h3>
            <p className="mt-2 flex-1 text-sm text-slate-400">{service.description}</p>
            <div className="mt-6 flex items-center justify-between border-t border-brand-border pt-4">
              <span className="text-2xl font-bold text-brand-blue-400">{formatCurrency(service.price)}</span>
              <span className="text-xs text-slate-500">{formatDuration(service.duration)}</span>
            </div>
          </div>
        ))}
      </div>

      {services && services.length > 0 && (
        <div className="mt-14 text-center">
          <Link to="/cadastro" className="btn-primary px-8 py-3 text-base">
            Agendar horário
          </Link>
        </div>
      )}
    </div>
  );
}
