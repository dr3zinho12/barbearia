import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { authService } from '../../services/auth.service';

export default function PerfilCliente() {
  useDocumentTitle('Meu perfil');
  const { user, refreshUser } = useAuth();
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const profileForm = useForm();
  const passwordForm = useForm();

  useEffect(() => {
    if (user) {
      profileForm.reset({ name: user.name, phone: user.phone });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function onSubmitProfile(data) {
    setIsSavingProfile(true);
    try {
      await authService.updateProfile(data);
      await refreshUser();
      toast.success('Dados atualizados com sucesso!');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function onSubmitPassword(data) {
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

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Meu perfil</h1>
        <p className="mt-1 text-sm text-slate-400">Atualize seus dados pessoais e sua senha de acesso.</p>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white">Dados pessoais</h2>
        <form className="mt-5 space-y-4" onSubmit={profileForm.handleSubmit(onSubmitProfile)} noValidate>
          <div>
            <label className="label" htmlFor="name">
              Nome completo
            </label>
            <input
              id="name"
              className="input"
              {...profileForm.register('name', { required: 'Informe seu nome', minLength: { value: 3, message: 'Nome muito curto' } })}
            />
            {profileForm.formState.errors.name && <p className="field-error">{profileForm.formState.errors.name.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="email-readonly">
              E-mail
            </label>
            <input id="email-readonly" className="input opacity-60" value={user?.email ?? ''} disabled />
          </div>

          <div>
            <label className="label" htmlFor="phone">
              Telefone
            </label>
            <input
              id="phone"
              className="input"
              {...profileForm.register('phone', {
                required: 'Informe seu telefone',
                pattern: { value: /^\d{10,11}$/, message: 'Telefone inválido. Use DDD + número, apenas dígitos' },
              })}
            />
            {profileForm.formState.errors.phone && <p className="field-error">{profileForm.formState.errors.phone.message}</p>}
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
