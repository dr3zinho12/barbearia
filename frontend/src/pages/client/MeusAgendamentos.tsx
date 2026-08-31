import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { CalendarIcon } from '../../components/icons';
import { Modal } from '../../components/Modal';
import { Spinner } from '../../components/Spinner';
import { StatusBadge } from '../../components/StatusBadge';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { appointmentsService } from '../../services/appointments.service';
import { Appointment, AvailabilitySlot } from '../../types';
import { formatCurrency, formatDateLong } from '../../utils/format';

function todayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function maxDateString(): string {
  const date = new Date();
  date.setDate(date.getDate() + 60);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function RescheduleModal({ appointment, onClose, onRescheduled }: { appointment: Appointment; onClose: () => void; onRescheduled: () => void }) {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSlots(null);
    setSelectedSlot(null);
    if (!date) return;
    setIsLoadingSlots(true);
    appointmentsService
      .getAvailability(appointment.barberId, appointment.serviceId, date)
      .then(setSlots)
      .catch((err) => {
        toast.error(extractErrorMessage(err));
        setSlots([]);
      })
      .finally(() => setIsLoadingSlots(false));
  }, [appointment.barberId, appointment.serviceId, date]);

  async function handleSubmit() {
    if (!date || !selectedSlot) return;
    setIsSubmitting(true);
    try {
      await appointmentsService.reschedule(appointment.id, { date, startTime: selectedSlot.startTime });
      toast.success('Agendamento remarcado com sucesso!');
      onRescheduled();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Não foi possível remarcar o agendamento'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Remarcar agendamento"
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-primary" disabled={!selectedSlot || isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'Remarcando...' : 'Confirmar nova data'}
          </button>
        </>
      }
    >
      <div>
        <label className="label" htmlFor="reschedule-date">
          Nova data
        </label>
        <input
          id="reschedule-date"
          type="date"
          className="input"
          min={todayDateString()}
          max={maxDateString()}
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>

      {date && (
        <div className="mt-5">
          <p className="label">Horários disponíveis</p>
          {isLoadingSlots && (
            <div className="mt-4 flex justify-center">
              <Spinner />
            </div>
          )}
          {!isLoadingSlots && slots?.length === 0 && <p className="text-sm text-slate-400">Nenhum horário disponível nesta data.</p>}
          {!isLoadingSlots && slots && slots.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.startTime}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-lg border px-2 py-2 text-sm font-medium transition ${
                    selectedSlot?.startTime === slot.startTime
                      ? 'border-brand-blue-500 bg-brand-blue-500 text-white'
                      : 'border-brand-border bg-brand-night text-slate-200 hover:border-brand-blue-500/50'
                  }`}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

export default function MeusAgendamentos() {
  useDocumentTitle('Meus agendamentos');
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  function loadAppointments() {
    appointmentsService.listMine().then(setAppointments).catch(() => setAppointments([]));
  }

  useEffect(loadAppointments, []);

  const today = todayDateString();
  const upcoming = appointments
    ?.filter((a) => (a.status === 'SCHEDULED' || a.status === 'CONFIRMED') && a.date.slice(0, 10) >= today)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));

  async function handleCancel() {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      await appointmentsService.cancel(cancelTarget.id);
      toast.success('Agendamento cancelado com sucesso.');
      setCancelTarget(null);
      loadAppointments();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Não foi possível cancelar o agendamento'));
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Meus agendamentos</h1>
      <p className="mt-1 text-sm text-slate-400">Acompanhe e gerencie seus próximos atendimentos.</p>

      {appointments === null && (
        <div className="mt-10 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {upcoming && upcoming.length === 0 && (
        <div className="mt-10">
          <EmptyState
            icon={<CalendarIcon className="h-10 w-10" />}
            title="Nenhum agendamento futuro"
            description="Agende um horário para vê-lo aqui."
          />
        </div>
      )}

      <div className="mt-8 space-y-4">
        {upcoming?.map((appointment) => (
          <div key={appointment.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-white">{appointment.service?.name}</h3>
                <StatusBadge status={appointment.status} />
              </div>
              <p className="mt-1 text-sm text-slate-400">Barbeiro: {appointment.barber?.name}</p>
              <p className="mt-1 text-sm text-slate-400 capitalize">{formatDateLong(appointment.date)}</p>
              <p className="mt-1 text-sm text-slate-400">
                Horário: {appointment.startTime} · {formatCurrency(appointment.service?.price ?? 0)}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-secondary" onClick={() => setRescheduleTarget(appointment)}>
                Remarcar
              </button>
              <button type="button" className="btn-danger" onClick={() => setCancelTarget(appointment)}>
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!cancelTarget}
        title="Cancelar agendamento"
        description="Tem certeza de que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
        confirmLabel="Sim, cancelar"
        danger
        isLoading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />

      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onRescheduled={() => {
            setRescheduleTarget(null);
            loadAppointments();
          }}
        />
      )}
    </div>
  );
}
