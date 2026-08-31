import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { ScissorsIcon } from '../../components/icons';
import { Spinner } from '../../components/Spinner';
import { brand } from '../../config/brand';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { barbersService } from '../../services/barbers.service';
import { servicesService } from '../../services/services.service';
import { Barber, Service } from '../../types';
import { formatCurrency, formatDuration } from '../../utils/format';

export default function Home() {
  useDocumentTitle('Início');
  const [services, setServices] = useState<Service[] | null>(null);
  const [barbers, setBarbers] = useState<Barber[] | null>(null);

  useEffect(() => {
    servicesService.list().then(setServices).catch(() => setServices([]));
    barbersService.list().then(setBarbers).catch(() => setBarbers([]));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-hero-radial">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center rounded-full border border-brand-blue-500/40 bg-brand-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-blue-300">
              {brand.name}
            </span>
            <h1 className="section-title mt-6 text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {brand.tagline}
            </h1>
            <p className="section-subtitle">{brand.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/cadastro" className="btn-primary px-8 py-3 text-base">
                Agendar horário
              </Link>
              <Link to="/servicos" className="btn-secondary px-8 py-3 text-base">
                Conhecer serviços
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-3xl border border-brand-border bg-gradient-to-br from-brand-surface to-brand-night shadow-2xl">
              <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-blue-500/15 text-brand-blue-300">
                  <ScissorsIcon className="h-14 w-14" />
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-white">Estilo é a nossa arte</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Barbeiros especializados, ambiente premium e agendamento 100% online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-title text-3xl">Nossos serviços</h2>
            <p className="section-subtitle">Preços justos e transparentes para cada estilo.</p>
          </div>
          <Link to="/servicos" className="btn-secondary shrink-0">
            Ver todos os serviços
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services === null && (
            <div className="col-span-full flex justify-center py-10">
              <Spinner />
            </div>
          )}
          {services?.length === 0 && (
            <div className="col-span-full">
              <EmptyState title="Nenhum serviço disponível" description="Volte em breve para conferir nossos serviços." />
            </div>
          )}
          {services?.slice(0, 6).map((service) => (
            <div key={service.id} className="card p-6 transition hover:border-brand-blue-500/50">
              <h3 className="text-lg font-semibold text-white">{service.name}</h3>
              <p className="mt-2 text-sm text-slate-400">{service.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-2xl font-bold text-brand-blue-400">{formatCurrency(service.price)}</span>
                <span className="text-xs text-slate-500">{formatDuration(service.duration)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-brand-border bg-brand-night">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="section-title text-3xl">Nossos barbeiros</h2>
              <p className="section-subtitle">Profissionais experientes prontos para cuidar do seu estilo.</p>
            </div>
            <Link to="/barbeiros" className="btn-secondary shrink-0">
              Ver todos os barbeiros
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {barbers === null && (
              <div className="col-span-full flex justify-center py-10">
                <Spinner />
              </div>
            )}
            {barbers?.length === 0 && (
              <div className="col-span-full">
                <EmptyState title="Nenhum barbeiro cadastrado" description="Em breve nossa equipe estará disponível." />
              </div>
            )}
            {barbers?.slice(0, 3).map((barber) => (
              <div key={barber.id} className="card p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue-500/15 text-xl font-bold text-brand-blue-300">
                  {barber.name.charAt(0)}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{barber.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{barber.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {barber.specialties.map((specialty) => (
                    <span key={specialty} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="section-title">Pronto para elevar seu estilo?</h2>
        <p className="section-subtitle mx-auto">
          Crie sua conta gratuitamente e agende seu próximo horário em poucos cliques.
        </p>
        <Link to="/cadastro" className="btn-primary mt-8 inline-flex px-8 py-3 text-base">
          Criar minha conta
        </Link>
      </section>
    </div>
  );
}
