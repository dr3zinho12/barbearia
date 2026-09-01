import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Spinner } from '../../components/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { authService } from '../../services/auth.service';
import { barbersService } from '../../services/barbers.service';
import { Barber } from '../../types';

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

export default function BarberPerfil() {
  useDocumentTitle('Meu perfil');
  const { user } = useAuth();
  const [barber, setBarber] = useState<Barber | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
