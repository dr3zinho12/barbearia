import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { barbersService } from '../../services/barbers.service';
import { businessHoursService } from '../../services/businessHours.service';
import { formatDate, weekdayLabel } from '../../utils/format';

export default function AdminHorarios() {
  useDocumentTitle('Horários de funcionamento');
  const [hours, setHours] = useState(null);
  const [isSavingHours, setIsSavingHours] = useState(false);

  const [blocked, setBlocked] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [isSubmittingBlock, setIsSubmittingBlock] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  function loadHours() {
    businessHoursService.get().then((data) => {
      setHours(
        [...data].sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((h) => ({
          dayOfWeek: h.dayOfWeek,
          startTime: h.startTime,
          endTime: h.endTime,
          closed: h.closed,
        })),
      );
    });
  }

  function loadBlocked() {
    businessHoursService.listBlocked().then(setBlocked).catch(() => setBlocked([]));
  }

  useEffect(() => {
    loadHours();
    loadBlocked();
    barbersService.list().then(setBarbers).catch(() => setBarbers([]));
    reset({ barberId: '', date: '', startTime: '', endTime: '', reason: '' });
  }, [reset]);

  function updateDay(dayOfWeek, changes) {
    setHours((current) => current?.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...changes } : day)) ?? current);
  }

  async function handleSaveHours() {
    if (!hours) return;
    setIsSavingHours(true);
    try {
      await businessHoursService.set(hours);
      toast.success('Horário de funcionamento atualizado com sucesso!');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSavingHours(false);
    }
  }

  async function onSubmitBlock(data) {
    setIsSubmittingBlock(true);
    try {
      await businessHoursService.createBlocked({
        barberId: data.barberId || undefined,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason || undefined,
      });
      toast.success('Bloqueio criado com sucesso!');
      reset({ barberId: '', date: '', startTime: '', endTime: '', reason: '' });
      loadBlocked();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSubmittingBlock(false);
    }
  }

  async function handleRemoveBlock(id) {
    try {
      await businessHoursService.removeBlocked(id);
      toast.success('Bloqueio removido com sucesso!');
      loadBlocked();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Horários de funcionamento</h1>
        <p className="mt-1 text-sm text-slate-400">Configure os horários padrão da barbearia e bloqueios específicos.</p>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white">Horário padrão semanal</h2>
        {!hours ? (
          <div className="mt-6 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {hours.map((day) => (
              <div key={day.dayOfWeek} className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-border bg-brand-night p-3">
                <span className="w-20 text-sm font-medium text-slate-200">{weekdayLabel(day.dayOfWeek)}</span>
                <label className="flex items-center gap-1.5 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={day.closed}
                    onChange={(event) => updateDay(day.dayOfWeek, { closed: event.target.checked })}
                    className="h-4 w-4 rounded border-brand-border bg-brand-night"
                  />
                  Fechado
                </label>
                {!day.closed && (
                  <>
                    <input type="time" className="input py-1.5 text-sm" value={day.startTime} onChange={(e) => updateDay(day.dayOfWeek, { startTime: e.target.value })} />
                    <span className="text-slate-500">até</span>
                    <input type="time" className="input py-1.5 text-sm" value={day.endTime} onChange={(e) => updateDay(day.dayOfWeek, { endTime: e.target.value })} />
                  </>
                )}
              </div>
            ))}
            <button type="button" className="btn-primary mt-2" onClick={handleSaveHours} disabled={isSavingHours}>
              {isSavingHours ? 'Salvando...' : 'Salvar horário padrão'}
            </button>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white">Bloquear horário específico</h2>
        <p className="mt-1 text-sm text-slate-400">Use para folgas, feriados ou manutenções. Deixe o barbeiro em branco para bloquear toda a barbearia.</p>

        <form className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" onSubmit={handleSubmit(onSubmitBlock)} noValidate>
          <select className="input" {...register('barberId')}>
            <option value="">Toda a barbearia</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>{barber.name}</option>
            ))}
          </select>
          <input type="date" className="input" {...register('date', { required: true })} />
          <input type="time" className="input" {...register('startTime', { required: true })} />
          <input type="time" className="input" {...register('endTime', { required: true })} />
          <input className="input" placeholder="Motivo (opcional)" {...register('reason')} />
          {(errors.date || errors.startTime || errors.endTime) && (
            <p className="field-error sm:col-span-2 lg:col-span-5">Informe data, horário inicial e horário final.</p>
          )}
          <button type="submit" className="btn-primary sm:col-span-2 lg:col-span-5" disabled={isSubmittingBlock}>
            {isSubmittingBlock ? 'Criando bloqueio...' : 'Criar bloqueio'}
          </button>
        </form>

        <div className="mt-6">
          {blocked === null && (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          )}
          {blocked?.length === 0 && <EmptyState title="Nenhum bloqueio cadastrado" />}
          {blocked && blocked.length > 0 && (
            <ul className="space-y-2">
              {blocked.map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded-lg border border-brand-border bg-brand-night p-3 text-sm">
                  <div>
                    <p className="font-medium text-white">
                      {formatDate(item.date)} · {item.startTime} - {item.endTime}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.barber?.name ?? 'Toda a barbearia'} {item.reason ? `· ${item.reason}` : ''}
                    </p>
                  </div>
                  <button type="button" className="font-medium text-red-400 hover:underline" onClick={() => handleRemoveBlock(item.id)}>
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
