import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { ScissorsIcon } from '../../components/icons';
import { Modal } from '../../components/Modal';
import { Spinner } from '../../components/Spinner';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { barbersService } from '../../services/barbers.service';
import { weekdayLabel } from '../../utils/format';

function GrantLoginModal({ barber, onClose, onGranted }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      await barbersService.grantLogin(barber.id, data);
      toast.success(`Acesso criado para ${barber.name}!`);
      onGranted();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Não foi possível criar o acesso'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen onClose={onClose} title={`Conceder acesso a ${barber.name}`}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="label" htmlFor="email">
            E-mail de acesso
          </label>
          <input
            id="email"
            type="email"
            className="input"
            {...register('email', {
              required: 'Informe o e-mail',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' },
            })}
          />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Telefone
          </label>
          <input
            id="phone"
            className="input"
            placeholder="11987654321"
            {...register('phone', {
              required: 'Informe o telefone',
              pattern: { value: /^\d{10,11}$/, message: 'Telefone inválido. Use DDD + número, apenas dígitos' },
            })}
          />
          {errors.phone && <p className="field-error">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">
            Senha provisória
          </label>
          <input
            id="password"
            type="password"
            className="input"
            placeholder="Mínimo 6 caracteres, com letras e números"
            {...register('password', {
              required: 'Informe uma senha',
              minLength: { value: 6, message: 'A senha deve ter pelo menos 6 caracteres' },
              pattern: { value: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: 'A senha deve conter letras e números' },
            })}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Criando...' : 'Criar acesso'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

const DEFAULT_WORKING_HOURS = Array.from({ length: 7 }, (_, dayOfWeek) => ({
  dayOfWeek,
  startTime: dayOfWeek === 0 ? '00:00' : '09:00',
  endTime: dayOfWeek === 0 ? '00:00' : '19:00',
  closed: dayOfWeek === 0,
}));

function WorkingHoursModal({ barber, onClose }) {
  const [hours, setHours] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    barbersService.getById(barber.id).then((full) => {
      if (full.workingHours && full.workingHours.length === 7) {
        setHours(
          [...full.workingHours]
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            .map((h) => ({ dayOfWeek: h.dayOfWeek, startTime: h.startTime, endTime: h.endTime, closed: h.closed })),
        );
      } else {
        setHours(DEFAULT_WORKING_HOURS);
      }
    });
  }, [barber.id]);

  function updateDay(dayOfWeek, changes) {
    setHours((current) => current?.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...changes } : day)) ?? current);
  }

  async function handleSave() {
    if (!hours) return;
    setIsSaving(true);
    try {
      await barbersService.setWorkingHours(barber.id, hours);
      toast.success('Horários atualizados com sucesso!');
      onClose();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Horários de ${barber.name}`}
      footer={
        <>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn-primary" onClick={handleSave} disabled={!hours || isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar horários'}
          </button>
        </>
      }
    >
      {!hours ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-3">
          {hours.map((day) => (
            <div key={day.dayOfWeek} className="flex items-center gap-3 rounded-lg border border-brand-border bg-brand-night p-3">
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
                  <input
                    type="time"
                    className="input py-1.5 text-sm"
                    value={day.startTime}
                    onChange={(event) => updateDay(day.dayOfWeek, { startTime: event.target.value })}
                  />
                  <span className="text-slate-500">até</span>
                  <input
                    type="time"
                    className="input py-1.5 text-sm"
                    value={day.endTime}
                    onChange={(event) => updateDay(day.dayOfWeek, { endTime: event.target.value })}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

export default function AdminBarbeiros() {
  useDocumentTitle('Barbeiros');
  const [barbers, setBarbers] = useState(null);
  const [editingBarber, setEditingBarber] = useState(null);
  const [hoursBarber, setHoursBarber] = useState(null);
  const [loginBarber, setLoginBarber] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  function loadBarbers() {
    barbersService.list().then(setBarbers).catch(() => setBarbers([]));
  }

  useEffect(loadBarbers, []);

  function openCreate() {
    reset({ name: '', description: '', photoUrl: '', specialties: '', active: true });
    setEditingBarber('new');
  }

  function openEdit(barber) {
    reset({
      name: barber.name,
      description: barber.description,
      photoUrl: barber.photoUrl ?? '',
      specialties: barber.specialties.join(', '),
      active: barber.active,
    });
    setEditingBarber(barber);
  }

  async function onSubmit(data) {
    setIsSubmitting(true);
    const payload = {
      name: data.name,
      description: data.description,
      photoUrl: data.photoUrl || undefined,
      specialties: data.specialties.split(',').map((s) => s.trim()).filter(Boolean),
      active: data.active,
    };

    try {
      if (editingBarber && editingBarber !== 'new') {
        await barbersService.update(editingBarber.id, payload);
        toast.success('Barbeiro atualizado com sucesso!');
      } else {
        await barbersService.create(payload);
        toast.success('Barbeiro cadastrado com sucesso!');
      }
      setEditingBarber(null);
      loadBarbers();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await barbersService.remove(deleteTarget.id);
      toast.success('Barbeiro removido com sucesso!');
      setDeleteTarget(null);
      loadBarbers();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Barbeiros</h1>
          <p className="mt-1 text-sm text-slate-400">Gerencie a equipe de barbeiros da barbearia.</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          Novo barbeiro
        </button>
      </div>

      {barbers === null && (
        <div className="mt-10 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {barbers?.length === 0 && (
        <div className="mt-10">
          <EmptyState icon={<ScissorsIcon className="h-10 w-10" />} title="Nenhum barbeiro cadastrado" action={<button type="button" className="btn-primary" onClick={openCreate}>Cadastrar barbeiro</button>} />
        </div>
      )}

      {barbers && barbers.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <div key={barber.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue-500/15 text-lg font-bold text-brand-blue-300">
                  {barber.name.charAt(0)}
                </div>
                <span className={barber.active ? 'text-xs font-medium text-emerald-400' : 'text-xs font-medium text-slate-500'}>
                  {barber.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-white">{barber.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{barber.specialties.join(', ')}</p>
              <p className="mt-2 text-xs">
                {barber.userId ? (
                  <span className="font-medium text-emerald-400">Com acesso ao painel</span>
                ) : (
                  <span className="font-medium text-amber-400">Sem acesso ao painel</span>
                )}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                <button type="button" className="font-medium text-brand-blue-400 hover:underline" onClick={() => openEdit(barber)}>
                  Editar
                </button>
                <button type="button" className="font-medium text-brand-blue-400 hover:underline" onClick={() => setHoursBarber(barber)}>
                  Horários
                </button>
                {!barber.userId && (
                  <button type="button" className="font-medium text-brand-blue-400 hover:underline" onClick={() => setLoginBarber(barber)}>
                    Conceder acesso
                  </button>
                )}
                <button type="button" className="font-medium text-red-400 hover:underline" onClick={() => setDeleteTarget(barber)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!editingBarber} onClose={() => setEditingBarber(null)} title={editingBarber === 'new' ? 'Novo barbeiro' : 'Editar barbeiro'}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="label" htmlFor="name">Nome</label>
            <input id="name" className="input" {...register('name', { required: 'Informe o nome' })} />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="description">Descrição</label>
            <textarea id="description" className="input min-h-[80px]" {...register('description', { required: 'Informe a descrição' })} />
            {errors.description && <p className="field-error">{errors.description.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="specialties">Especialidades (separadas por vírgula)</label>
            <input id="specialties" className="input" placeholder="Degradê, Barba, Navalha" {...register('specialties', { required: 'Informe ao menos uma especialidade' })} />
            {errors.specialties && <p className="field-error">{errors.specialties.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="photoUrl">URL da foto (opcional)</label>
            <input id="photoUrl" className="input" placeholder="https://..." {...register('photoUrl')} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="h-4 w-4 rounded border-brand-border bg-brand-night" {...register('active')} />
            Barbeiro ativo
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-ghost" onClick={() => setEditingBarber(null)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      {hoursBarber && <WorkingHoursModal barber={hoursBarber} onClose={() => setHoursBarber(null)} />}

      {loginBarber && (
        <GrantLoginModal
          barber={loginBarber}
          onClose={() => setLoginBarber(null)}
          onGranted={() => {
            setLoginBarber(null);
            loadBarbers();
          }}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Excluir barbeiro"
        description={`Tem certeza de que deseja excluir "${deleteTarget?.name}"? Se houver agendamentos vinculados, o barbeiro será apenas desativado.`}
        confirmLabel="Excluir"
        danger
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
