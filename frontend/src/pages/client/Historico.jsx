import { useEffect, useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { HistoryIcon } from '../../components/icons';
import { Spinner } from '../../components/Spinner';
import { StatusBadge } from '../../components/StatusBadge';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { appointmentsService } from '../../services/appointments.service';
import { formatCurrency, formatDate } from '../../utils/format';

export default function Historico() {
  useDocumentTitle('Histórico');
  const [appointments, setAppointments] = useState(null);

  useEffect(() => {
    appointmentsService.listMine().then(setAppointments).catch(() => setAppointments([]));
  }, []);

  const history = appointments
    ?.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELED' || a.status === 'NO_SHOW')
    .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Histórico</h1>
      <p className="mt-1 text-sm text-slate-400">Todos os seus atendimentos passados, cancelados ou não realizados.</p>

      {appointments === null && (
        <div className="mt-10 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {history && history.length === 0 && (
        <div className="mt-10">
          <EmptyState icon={<HistoryIcon className="h-10 w-10" />} title="Nenhum atendimento no histórico" />
        </div>
      )}

      {history && history.length > 0 && (
        <div className="table-shell mt-8">
          <table className="table-base">
            <thead>
              <tr>
                <th>Data</th>
                <th>Serviço</th>
                <th>Barbeiro</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{formatDate(appointment.date)} · {appointment.startTime}</td>
                  <td>{appointment.service?.name}</td>
                  <td>{appointment.barber?.name}</td>
                  <td>{formatCurrency(appointment.service?.price ?? 0)}</td>
                  <td>
                    <StatusBadge status={appointment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
