import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { authService } from '../../services/auth.service';

interface ResetForm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export default function RedefinirSenha() {
  useDocumentTitle('Redefinir senha');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetForm>({ defaultValues: { token: searchParams.get('token') ?? '' } });

  async function onSubmit(data: ResetForm) {
    setIsSubmitting(true);
    try {
      await authService.resetPassword({ token: data.token, newPassword: data.newPassword });
      toast.success('Senha redefinida com sucesso! Faça login com sua nova senha.');
      navigate('/login');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Token inválido ou expirado'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-white">Redefinir senha</h1>
        <p className="mt-2 text-sm text-slate-400">Cole o token recebido e defina sua nova senha.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="label" htmlFor="token">
              Token de recuperação
            </label>
            <input
              id="token"
              className="input"
              placeholder="Cole aqui o token recebido"
              {...register('token', { required: 'Informe o token de recuperação' })}
            />
            {errors.token && <p className="field-error">{errors.token.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="newPassword">
              Nova senha
            </label>
            <input
              id="newPassword"
              type="password"
              className="input"
              placeholder="Mínimo 6 caracteres, com letras e números"
              {...register('newPassword', {
                required: 'Informe a nova senha',
                minLength: { value: 6, message: 'A senha deve ter pelo menos 6 caracteres' },
                pattern: { value: /^(?=.*[A-Za-z])(?=.*\d).+$/, message: 'A senha deve conter letras e números' },
              })}
            />
            {errors.newPassword && <p className="field-error">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirmar nova senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              placeholder="Repita a nova senha"
              {...register('confirmPassword', {
                required: 'Confirme a nova senha',
                validate: (value) => value === watch('newPassword') || 'As senhas não coincidem',
              })}
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/login" className="font-medium text-brand-blue-400 hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
