import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { CalendarIcon, ClockIcon, HistoryIcon } from '../../components/icons';
import { Modal } from '../../components/Modal';
import { Spinner } from '../../components/Spinner';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { appointmentsService } from '../../services/appointments.service';
import { barbersService } from '../../services/barbers.service';
import { formatCurrency, formatDate, todayDateString } from '../../utils/format';

const STATUS_OPTIONS = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELED', 'NO_SHOW'];

function defaultBreakTimes() {
  const now = new Date();
  now.setMinutes(now.getMinutes() < 30 ? 30 : 60, 0, 0);
  const start = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const endDate = new Date(now.getTime() + 60 * 60 * 1000);
  const end = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
  return { start, end };
}

export default function BarberDashboard() {
  useDocumentTitle('Minha agenda');
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(null);
  const [breaks, setBreaks] = useState(null);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isSubmittingBreak, setIsSubmittingBreak] = useState(false);
  const [removeBreakTarget, setRemoveBreakTarget] = useState(null);
  const [isRemovingBreak, setIsRemovingBreak] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  function loadAppointments() {
    // Sem filtro de data: traz toda a fila de atendimentos e o histórico de uma vez.
    appointmentsService.listAll({ pageSize: 500 }).then((result) => setAppointments(result.data)).catch(() => setAppointments([]));
  }

  function loadBreaks() {
    barbersService.listMyBreaks().then(setBreaks).catch(() => setBreaks([]));
  }

  useEffect(loadAppointments, []);
  useEffect(loadBreaks, []);

  function openBreakModal() {
    const defaults = defaultBreakTimes();
    reset({ date: todayDateString(), startTime: defaults.start, endTime: defaults.end, reason: 'Horário de almoço' });
    setIsBreakModalOpen(true);
  }

  async function onSubmitBreak(data) {
    setIsSubmittingBreak(true);
    try {
      await barbersService.createMyBreak(data);
      toast.success('Horário bloqueado com sucesso! Você aparecerá como indisponível nesse período.');
      setIsBreakModalOpen(false);
      loadBreaks();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Não foi possível bloquear o horário'));
    } finally {
      setIsSubmittingBreak(false);
    }
  }

  async function handleRemoveBreak() {
    if (!removeBreakTarget) return;
    setIsRemovingBreak(true);
    try {
      await barbersService.removeMyBreak(removeBreakTarget.id);
      toast.success('Você está disponível novamente nesse horário.');
      setRemoveBreakTarget(null);
      loadBreaks();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsRemovingBreak(false);
    }
  }

  async function handleStatusChange(appointment, status) {
    try {
      await appointmentsService.updateStatus(appointment.id, status);
      toast.success('Status atualizado com sucesso!');
      loadAppointments();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  const upcomingBreaks = breaks
    ?.filter((b) => b.date.slice(0, 10) >= todayDateString())
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  const queue = appointments
    ?.filter((a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED')
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  const history = appointments
    ?.filter((a) => a.status === 'COMPLETED' || a.status === 'CANCELED' || a.status === 'NO_SHOW')
    .sort((a, b) => (b.date + b.startTime).localeCompare(a.date + a.startTime));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Olá, {user?.name.split(' ')[0]}!</h1>
        <p className="mt-1 text-sm text-slate-400">Acompanhe sua agenda e gerencie sua disponibilidade.</p>
      </div>

      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <ClockIcon className="h-5 w-5 text-brand-blue-400" />
            Horário de almoço / indisponibilidade
          </h2>
          <button type="button" className="btn-primary" onClick={openBreakModal}>
            Marcar horário de almoço
          </button>
        </div>

        <div className="mt-5">
          {breaks === null && (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}
          {upcomingBreaks?.length === 0 && (
            <p className="text-sm text-slate-400">Nenhum bloqueio futuro. Você está disponível em todo o seu expediente.</p>
          )}
          {upcomingBreaks && upcomingBreaks.length > 0 && (
            <ul className="space-y-2">
              {upcomingBreaks.map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded-lg border border-brand-border bg-brand-night p-3 text-sm">
                  <div>
                    <p className="font-medium text-white">
                      {formatDate(item.date)} · {item.startTime} - {item.endTime}
                    </p>
                    {item.reason && <p className="text-xs text-slate-500">{item.reason}</p>}
                  </div>
                  <button type="button" className="font-medium text-red-400 hover:underline" onClick={() => setRemoveBreakTarget(item)}>
                    Voltar a ficar disponível
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <CalendarIcon className="h-5 w-5 text-brand-blue-400" />
          Fila de atendimentos
        </h2>
        <p className="mt-1 text-sm text-slate-400">Todos os seus agendamentos pendentes, de qualquer data.</p>

        {appointments === null && (
          <div className="mt-6 flex justify-center">
            <Spinner />
          </div>
        )}

        {queue?.length === 0 && (
          <div className="mt-4">
            <EmptyState title="Nenhum agendamento na fila" description="Você não tem atendimentos pendentes." />
          </div>
        )}

        {queue && queue.length > 0 && (
          <div className="table-shell mt-5">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Cliente</th>
                  <th>Serviço</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{formatDate(appointment.date)}</td>
                    <td>{appointment.startTime}</td>
                    <td>{appointment.client?.name}</td>
                    <td>{appointment.service?.name}</td>
                    <td>{formatCurrency(appointment.service?.price ?? 0)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={appointment.status} />
                        <select
                          className="rounded-lg border border-brand-border bg-brand-night px-2 py-1 text-xs text-slate-300"
                          value={appointment.status}
                          onChange={(event) => handleStatusChange(appointment, event.target.value)}
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <HistoryIcon className="h-5 w-5 text-brand-blue-400" />
          Histórico
        </h2>
        <p className="mt-1 text-sm text-slate-400">Atendimentos concluídos, cancelados ou não comparecidos.</p>

        {appointments === null && (
          <div className="mt-6 flex justify-center">
            <Spinner />
          </div>
        )}

        {history?.length === 0 && (
          <div className="mt-4">
            <EmptyState title="Nenhum atendimento no histórico" />
          </div>
        )}

        {history && history.length > 0 && (
          <div className="table-shell mt-5">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Cliente</th>
                  <th>Serviço</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{formatDate(appointment.date)}</td>
                    <td>{appointment.startTime}</td>
                    <td>{appointment.client?.name}</td>
                    <td>{appointment.service?.name}</td>
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

      <Modal isOpen={isBreakModalOpen} onClose={() => setIsBreakModalOpen(false)} title="Marcar horário de almoço/indisponibilidade">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmitBreak)} noValidate>
          <div>
            <label className="label" htmlFor="date">
              Data
            </label>
            <input id="date" type="date" className="input" {...register('date', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="startTime">
                Início
              </label>
              <input id="startTime" type="time" className="input" {...register('startTime', { required: true })} />
            </div>
            <div>
              <label className="label" htmlFor="endTime">
                Fim
              </label>
              <input id="endTime" type="time" className="input" {...register('endTime', { required: true })} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="reason">
              Motivo
            </label>
            <input id="reason" className="input" {...register('reason')} />
          </div>
          {(errors.date || errors.startTime || errors.endTime) && (
            <p className="field-error">Informe data, horário de início e horário de fim.</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-ghost" onClick={() => setIsBreakModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmittingBreak}>
              {isSubmittingBreak ? 'Salvando...' : 'Bloquear horário'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!removeBreakTarget}
        title="Voltar a ficar disponível"
        description="Tem certeza de que deseja remover este bloqueio? O horário voltará a ficar disponível para agendamento."
        confirmLabel="Remover bloqueio"
        isLoading={isRemovingBreak}
        onConfirm={handleRemoveBreak}
        onCancel={() => setRemoveBreakTarget(null)}
      />
    </div>
  );
}
