import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { appointmentsService } from '../../services/appointments.service';
import { barbersService } from '../../services/barbers.service';
import { servicesService } from '../../services/services.service';
import { AvailabilitySlot, Barber, Service } from '../../types';
import { formatCurrency, formatDuration } from '../../utils/format';

const STEPS = ['Serviço', 'Barbeiro', 'Data e horário', 'Confirmação'];

function todayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function maxDateString(): string {
  const date = new Date();
  date.setDate(date.getDate() + 60);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function NovoAgendamento() {
  useDocumentTitle('Agendar horário');
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[] | null>(null);
  const [barbers, setBarbers] = useState<Barber[] | null>(null);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [notes, setNotes] = useState('');

  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    servicesService.list().then(setServices).catch(() => setServices([]));
    barbersService.list().then(setBarbers).catch(() => setBarbers([]));
  }, []);

  const selectedService = useMemo(() => services?.find((s) => s.id === selectedServiceId) ?? null, [services, selectedServiceId]);
  const selectedBarber = useMemo(() => barbers?.find((b) => b.id === selectedBarberId) ?? null, [barbers, selectedBarberId]);

  useEffect(() => {
    setSlots(null);
    setSelectedSlot(null);
    if (!selectedBarberId || !selectedServiceId || !selectedDate) return;

    setIsLoadingSlots(true);
    appointmentsService
      .getAvailability(selectedBarberId, selectedServiceId, selectedDate)
      .then(setSlots)
      .catch((err) => {
        toast.error(extractErrorMessage(err, 'Não foi possível carregar os horários disponíveis'));
        setSlots([]);
      })
      .finally(() => setIsLoadingSlots(false));
  }, [selectedBarberId, selectedServiceId, selectedDate]);

  function goToStep(nextStep: number) {
    setStep(nextStep);
  }

  async function handleConfirm() {
    if (!selectedBarberId || !selectedServiceId || !selectedDate || !selectedSlot) return;

    setIsSubmitting(true);
    try {
      await appointmentsService.create({
        barberId: selectedBarberId,
        serviceId: selectedServiceId,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        notes: notes.trim() || undefined,
      });
      toast.success('Agendamento realizado com sucesso!');
      navigate('/cliente/agendamentos');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Não foi possível concluir o agendamento'));
      setSlots(null);
      setSelectedSlot(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-white">Agendar horário</h1>
      <p className="mt-1 text-sm text-slate-400">Siga os passos abaixo para marcar seu atendimento.</p>

      <ol className="mt-8 grid grid-cols-4 gap-2">
        {STEPS.map((label, index) => (
          <li key={label} className="flex flex-col items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                index <= step ? 'bg-brand-blue-500 text-white' : 'bg-white/5 text-slate-500'
              }`}
            >
              {index + 1}
            </span>
            <span className={`hidden text-center text-xs sm:block ${index <= step ? 'text-white' : 'text-slate-500'}`}>
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="card mt-8 p-6">
        {step === 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white">Escolha o serviço</h2>
            {services === null && (
              <div className="mt-6 flex justify-center">
                <Spinner />
              </div>
            )}
            {services?.length === 0 && <EmptyState title="Nenhum serviço disponível" />}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {services?.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedServiceId === service.id
                      ? 'border-brand-blue-500 bg-brand-blue-500/10'
                      : 'border-brand-border bg-brand-night hover:border-brand-blue-500/40'
                  }`}
                >
                  <p className="font-semibold text-white">{service.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDuration(service.duration)}</p>
                  <p className="mt-2 text-lg font-bold text-brand-blue-400">{formatCurrency(service.price)}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button type="button" className="btn-primary" disabled={!selectedServiceId} onClick={() => goToStep(1)}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-white">Escolha o barbeiro</h2>
            {barbers === null && (
              <div className="mt-6 flex justify-center">
                <Spinner />
              </div>
            )}
            {barbers?.length === 0 && <EmptyState title="Nenhum barbeiro disponível" />}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {barbers?.map((barber) => (
                <button
                  key={barber.id}
                  type="button"
                  onClick={() => setSelectedBarberId(barber.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedBarberId === barber.id
                      ? 'border-brand-blue-500 bg-brand-blue-500/10'
                      : 'border-brand-border bg-brand-night hover:border-brand-blue-500/40'
                  }`}
                >
                  <p className="font-semibold text-white">{barber.name}</p>
                  <p className="mt-1 text-xs text-slate-400">{barber.specialties.join(', ')}</p>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button type="button" className="btn-ghost" onClick={() => goToStep(0)}>
                Voltar
              </button>
              <button type="button" className="btn-primary" disabled={!selectedBarberId} onClick={() => goToStep(2)}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-white">Escolha a data e o horário</h2>
            <div className="mt-5">
              <label className="label" htmlFor="date">
                Data
              </label>
              <input
                id="date"
                type="date"
                className="input max-w-xs"
                min={todayDateString()}
                max={maxDateString()}
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>

            {selectedDate && (
              <div className="mt-6">
                <p className="label">Horários disponíveis</p>
                {isLoadingSlots && (
                  <div className="mt-4 flex justify-center">
                    <Spinner />
                  </div>
                )}
                {!isLoadingSlots && slots?.length === 0 && (
                  <EmptyState
                    title="Nenhum horário disponível nesta data"
                    description="Escolha outra data ou outro barbeiro."
                  />
                )}
                {!isLoadingSlots && slots && slots.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {slots.map((slot) => (
                      <button
                        key={slot.startTime}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
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

            <div className="mt-6 flex justify-between">
              <button type="button" className="btn-ghost" onClick={() => goToStep(1)}>
                Voltar
              </button>
              <button type="button" className="btn-primary" disabled={!selectedSlot} onClick={() => goToStep(3)}>
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-white">Confirme seu agendamento</h2>
            <div className="mt-5 space-y-3 rounded-xl border border-brand-border bg-brand-night p-5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Serviço</span>
                <span className="font-medium text-white">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Barbeiro</span>
                <span className="font-medium text-white">{selectedBarber?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Data</span>
                <span className="font-medium text-white">{selectedDate.split('-').reverse().join('/')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Horário</span>
                <span className="font-medium text-white">{selectedSlot?.startTime}</span>
              </div>
              <div className="flex justify-between border-t border-brand-border pt-3">
                <span className="text-slate-400">Valor</span>
                <span className="text-lg font-bold text-brand-blue-400">{formatCurrency(selectedService?.price ?? 0)}</span>
              </div>
            </div>

            <div className="mt-5">
              <label className="label" htmlFor="notes">
                Observações (opcional)
              </label>
              <textarea
                id="notes"
                className="input min-h-[90px]"
                placeholder="Alguma preferência ou observação para o barbeiro?"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                maxLength={500}
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button type="button" className="btn-ghost" onClick={() => goToStep(2)}>
                Voltar
              </button>
              <button type="button" className="btn-primary" onClick={handleConfirm} disabled={isSubmitting}>
                {isSubmitting ? 'Confirmando...' : 'Confirmar agendamento'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
