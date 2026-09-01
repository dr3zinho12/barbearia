import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { CalendarIcon, MessageIcon } from '../../components/icons';
import { Spinner } from '../../components/Spinner';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { appointmentsService } from '../../services/appointments.service';
import { plansService } from '../../services/plans.service';
import { formatCurrency, formatDateLong, todayDateString } from '../../utils/format';

function tomorrowDateString() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function ClientDashboard() {
  useDocumentTitle('Minha área');
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isReminderDismissed, setIsReminderDismissed] = useState(false);

  useEffect(() => {
    appointmentsService.listMine().then(setAppointments).catch(() => setAppointments([]));
    plansService.getCurrentSubscription().then(setSubscription).catch(() => setSubscription(null));
  }, []);

  const today = todayDateString();
  const nextAppointment = appointments
    ?.filter((a) => (a.status === 'SCHEDULED' || a.status === 'CONFIRMED') && a.date.slice(0, 10) >= today)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))[0];

  const isReminderDue = !!nextAppointment && nextAppointment.date.slice(0, 10) === tomorrowDateString();
  const firstName = user?.name.split(' ')[0] ?? '';
  const reminderMessage = nextAppointment
    ? `Olá, ${firstName}! Passando para confirmar seu horário de amanhã às ${nextAppointment.startTime}, para ${nextAppointment.service?.name} com ${nextAppointment.barber?.name}. Vai conseguir vir, ou prefere cancelar?`
    : '';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Olá, {user?.name.split(' ')[0]}!</h1>
        <p className="mt-1 text-sm text-slate-400">Bem-vindo(a) de volta à sua área exclusiva.</p>
      </div>

      {isReminderDue && !isReminderDismissed && (
        <div className="card border-brand-blue-400/60 p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue-500/15 text-brand-blue-300">
              <MessageIcon className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue-300">
                Lembrete de amanhã · simulação de mensagem por WhatsApp
              </p>
              <p className="mt-2 rounded-xl rounded-tl-none bg-brand-night p-3 text-sm text-slate-200">{reminderMessage}</p>
              <p className="mt-2 text-xs text-slate-500">
                Em um ambiente de produção, esta mensagem seria enviada de verdade para o seu WhatsApp cadastrado, um dia
                antes do atendimento.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn-secondary" onClick={() => setIsReminderDismissed(true)}>
                  Tudo certo, vou comparecer
                </button>
                <Link to="/cliente/agendamentos" className="btn-ghost">
                  Preciso cancelar ou remarcar
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Próximo atendimento</h2>
            <CalendarIcon className="h-5 w-5 text-brand-blue-400" />
          </div>

          {appointments === null && (
            <div className="mt-6 flex justify-center">
              <Spinner />
            </div>
          )}

          {appointments && !nextAppointment && (
            <div className="mt-4">
              <EmptyState
                title="Você não tem agendamentos futuros"
                description="Que tal agendar seu próximo horário agora mesmo?"
                action={
                  <Link to="/cliente/agendamento" className="btn-primary">
                    Agendar horário
                  </Link>
                }
              />
            </div>
          )}

          {nextAppointment && (
            <div className="mt-5 rounded-xl border border-brand-border bg-brand-night p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold text-white">{nextAppointment.service?.name}</h3>
                <StatusBadge status={nextAppointment.status} />
              </div>
              <p className="mt-2 text-sm text-slate-400">Barbeiro: {nextAppointment.barber?.name}</p>
              <p className="mt-1 text-sm text-slate-400 capitalize">{formatDateLong(nextAppointment.date)}</p>
              <p className="mt-1 text-sm text-slate-400">Horário: {nextAppointment.startTime}</p>
              <Link to="/cliente/agendamentos" className="btn-secondary mt-4 inline-flex">
                Ver agendamento
              </Link>
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white">Plano atual</h2>
          {subscription === null ? (
            <div className="mt-4">
              <p className="text-sm text-slate-400">Você ainda não possui um plano ativo.</p>
              <Link to="/cliente/planos" className="btn-primary mt-4 inline-flex w-full justify-center">
                Ver planos
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-xl font-bold text-brand-blue-400">{subscription.plan?.name}</p>
              <p className="mt-1 text-sm text-slate-400">{formatCurrency(subscription.plan?.price ?? 0)}/mês</p>
              <ul className="mt-4 space-y-2">
                {subscription.plan?.benefits.slice(0, 3).map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-brand-blue-400">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link to="/cliente/planos" className="btn-secondary mt-4 inline-flex w-full justify-center">
                Ver benefícios
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/cliente/agendamento" className="card p-5 transition hover:border-brand-blue-500/60">
          <p className="font-semibold text-white">Agendar horário</p>
          <p className="mt-1 text-sm text-slate-400">Escolha serviço, barbeiro e horário.</p>
        </Link>
        <Link to="/cliente/historico" className="card p-5 transition hover:border-brand-blue-500/60">
          <p className="font-semibold text-white">Histórico</p>
          <p className="mt-1 text-sm text-slate-400">Veja seus atendimentos anteriores.</p>
        </Link>
        <Link to="/cliente/perfil" className="card p-5 transition hover:border-brand-blue-500/60">
          <p className="font-semibold text-white">Meu perfil</p>
          <p className="mt-1 text-sm text-slate-400">Atualize seus dados pessoais.</p>
        </Link>
      </div>
    </div>
  );
}
