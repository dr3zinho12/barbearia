import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { CalendarIcon, ChartIcon, ScissorsIcon, UsersIcon } from '../../components/icons';
import { Spinner } from '../../components/Spinner';
import { StatCard } from '../../components/StatCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { adminService } from '../../services/admin.service';
import { DashboardSummary } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

export default function AdminDashboard() {
  useDocumentTitle('Dashboard');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    adminService.getDashboard().then(setSummary).catch(() => setSummary(null));
  }, []);

  if (!summary) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const maxServiceCount = Math.max(1, ...summary.topServices.map((item) => item.count));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Visão geral do desempenho da barbearia.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Clientes ativos" value={summary.totalClients} icon={<UsersIcon className="h-5 w-5" />} />
        <StatCard label="Barbeiros ativos" value={summary.totalBarbers} icon={<ScissorsIcon className="h-5 w-5" />} />
        <StatCard label="Agendamentos hoje" value={summary.appointmentsToday} icon={<CalendarIcon className="h-5 w-5" />} />
        <StatCard label="Agendamentos na semana" value={summary.appointmentsThisWeek} icon={<CalendarIcon className="h-5 w-5" />} />
        <StatCard label="Assinaturas ativas" value={summary.activeSubscriptions} icon={<ChartIcon className="h-5 w-5" />} />
        <StatCard label="Cancelamentos na semana" value={summary.cancellationsThisWeek} icon={<ChartIcon className="h-5 w-5" />} />
        <StatCard
          label="Faturamento estimado"
          value={formatCurrency(summary.estimatedRevenue)}
          hint="Soma dos atendimentos concluídos"
          icon={<ChartIcon className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white">Próximos horários</h2>
          {summary.nextAppointments.length === 0 && (
            <div className="mt-4">
              <EmptyState title="Nenhum agendamento futuro" />
            </div>
          )}
          <ul className="mt-4 space-y-3">
            {summary.nextAppointments.map((appointment) => (
              <li key={appointment.id} className="flex items-center justify-between rounded-xl border border-brand-border bg-brand-night p-4">
                <div>
                  <p className="font-medium text-white">{appointment.service?.name}</p>
                  <p className="text-xs text-slate-400">
                    {appointment.client?.name} · {appointment.barber?.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDate(appointment.date)} às {appointment.startTime}
                  </p>
                </div>
                <StatusBadge status={appointment.status} />
              </li>
            ))}
          </ul>
          <Link to="/admin/agendamentos" className="btn-secondary mt-5 inline-flex">
            Ver todos os agendamentos
          </Link>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white">Serviços mais agendados</h2>
          {summary.topServices.length === 0 && (
            <div className="mt-4">
              <EmptyState title="Ainda não há dados suficientes" />
            </div>
          )}
          <ul className="mt-5 space-y-4">
            {summary.topServices.map((item) => (
              <li key={item.service?.id}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-200">{item.service?.name}</span>
                  <span className="text-slate-400">{item.count} agendamentos</span>
                </div>
                <div className="mt-1.5 h-2 w-full rounded-full bg-white/5">
                  <div
                    className="h-2 rounded-full bg-brand-blue-500"
                    style={{ width: `${(item.count / maxServiceCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
