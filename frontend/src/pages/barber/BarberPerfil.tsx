import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { authService } from '../../services/auth.service';
import { barbersService, DayWorkingHourPayload } from '../../services/barbers.service';
import { Barber } from '../../types';
import { weekdayLabel } from '../../utils/format';

interface ProfileForm {
  description: string;
  specialties: string;
  photoUrl: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const DEFAULT_WORKING_HOURS: DayWorkingHourPayload[] = Array.from({ length: 7 }, (_, dayOfWeek) => ({
  dayOfWeek,
  startTime: dayOfWeek === 0 ? '00:00' : '09:00',
  endTime: dayOfWeek === 0 ? '00:00' : '19:00',
  closed: dayOfWeek === 0,
}));

export default function BarberPerfil() {
  useDocumentTitle('Meu perfil');
  const { user } = useAuth();
  const [barber, setBarber] = useState<Barber | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [workingHours, setWorkingHours] = useState<DayWorkingHourPayload[] | null>(null);
  const [isSavingHours, setIsSavingHours] = useState(false);

  const profileForm = useForm<ProfileForm>();
  const passwordForm = useForm<PasswordForm>();

  useEffect(() => {
    barbersService.getMe().then((data) => {
      setBarber(data);
      profileForm.reset({
        description: data.description,
        specialties: data.specialties.join(', '),
        photoUrl: data.photoUrl ?? '',
      });

      if (data.workingHours && data.workingHours.length === 7) {
        setWorkingHours(
          [...data.workingHours]
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            .map((h) => ({ dayOfWeek: h.dayOfWeek, startTime: h.startTime, endTime: h.endTime, closed: h.closed })),
        );
      } else {
        setWorkingHours(DEFAULT_WORKING_HOURS);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateDay(dayOfWeek: number, changes: Partial<DayWorkingHourPayload>) {
    setWorkingHours((current) => current?.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, ...changes } : day)) ?? current);
  }

  async function handleSaveHours() {
    if (!workingHours) return;
    setIsSavingHours(true);
    try {
      await barbersService.updateMyWorkingHours(workingHours);
      toast.success('Expediente atualizado com sucesso!');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSavingHours(false);
    }
  }

  async function onSubmitProfile(data: ProfileForm) {
    setIsSavingProfile(true);
    try {
      const updated = await barbersService.updateMe({
        description: data.description,
        photoUrl: data.photoUrl || undefined,
        specialties: data.specialties.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setBarber(updated);
      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function onSubmitPassword(data: PasswordForm) {
    setIsSavingPassword(true);
    try {
      await authService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Senha alterada com sucesso!');
      passwordForm.reset();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Não foi possível alterar a senha'));
    } finally {
      setIsSavingPassword(false);
    }
  }

  if (!barber) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Meu perfil</h1>
        <p className="mt-1 text-sm text-slate-400">
          Estas informações aparecem publicamente na página de barbeiros do site.
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white">Dados de acesso</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="label">Nome</p>
            <p className="text-sm text-slate-300">{barber.name}</p>
          </div>
          <div>
            <p className="label">E-mail</p>
            <p className="text-sm text-slate-300">{user?.email}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Nome e status (ativo/inativo) são gerenciados pela administração da barbearia.
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white">Descrição e especialidades</h2>
        <form className="mt-5 space-y-4" onSubmit={profileForm.handleSubmit(onSubmitProfile)} noValidate>
          <div>
            <label className="label" htmlFor="description">
              Descrição
            </label>
            <textarea
              id="description"
              className="input min-h-[90px]"
              {...profileForm.register('description', { required: 'Informe uma descrição' })}
            />
            {profileForm.formState.errors.description && (
              <p className="field-error">{profileForm.formState.errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="specialties">
              Especialidades / diferenciais (separados por vírgula)
            </label>
            <input
              id="specialties"
              className="input"
              placeholder="Degradê, Barba, Navalha"
              {...profileForm.register('specialties', { required: 'Informe ao menos uma especialidade' })}
            />
            {profileForm.formState.errors.specialties && (
              <p className="field-error">{profileForm.formState.errors.specialties.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="photoUrl">
              URL da foto (opcional)
            </label>
            <input id="photoUrl" className="input" placeholder="https://..." {...profileForm.register('photoUrl')} />
          </div>

          <button type="submit" className="btn-primary" disabled={isSavingProfile}>
            {isSavingProfile ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white">Meu expediente semanal</h2>
        <p className="mt-1 text-sm text-slate-400">
          Defina os dias e horários em que você atende. Isso substitui o horário padrão da barbearia para você.
        </p>

        {!workingHours ? (
          <div className="mt-6 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {workingHours.map((day) => (
              <div key={day.dayOfWeek} className="flex flex-wrap items-center gap-3 rounded-lg border border-brand-border bg-brand-night p-3">
                <span className="w-20 text-sm font-medium text-slate-200">{weekdayLabel(day.dayOfWeek)}</span>
                <label className="flex items-center gap-1.5 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={day.closed}
                    onChange={(event) => updateDay(day.dayOfWeek, { closed: event.target.checked })}
                    className="h-4 w-4 rounded border-brand-border bg-brand-night"
                  />
                  Não atendo
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
            <button type="button" className="btn-primary mt-2" onClick={handleSaveHours} disabled={isSavingHours}>
              {isSavingHours ? 'Salvando...' : 'Salvar expediente'}
            </button>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white">Alterar senha</h2>
        <form className="mt-5 space-y-4" onSubmit={passwordForm.handleSubmit(onSubmitPassword)} noValidate>
          <div>
            <label className="label" htmlFor="currentPassword">
              Senha atual
            </label>
            <input
              id="currentPassword"
              type="password"
              className="input"
              {...passwordForm.register('currentPassword', { required: 'Informe sua senha atual' })}
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="field-error">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="newPassword">
              Nova senha
            </label>
            <input
              id="newPassword"
              type="password"
              className="input"
              {...passwordForm.register('newPassword', {
                required: 'Informe a nova senha',
                minLength: { value: 6, message: 'A senha deve ter pelo menos 6 caracteres' },
                pattern: { value: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: 'A senha deve conter letras e números' },
              })}
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="field-error">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirmar nova senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              {...passwordForm.register('confirmPassword', {
                required: 'Confirme a nova senha',
                validate: (value) => value === passwordForm.watch('newPassword') || 'As senhas não coincidem',
              })}
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="field-error">{passwordForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={isSavingPassword}>
            {isSavingPassword ? 'Alterando...' : 'Alterar senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
