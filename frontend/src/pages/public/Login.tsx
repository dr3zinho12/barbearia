import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  useDocumentTitle('Entrar');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  async function onSubmit(data: LoginForm) {
    setIsSubmitting(true);
    try {
      const user = await login(data);
      toast.success(`Bem-vindo(a) de volta, ${user.name.split(' ')[0]}!`);
      const redirectTo = (location.state as { from?: Location })?.from?.pathname;
      navigate(redirectTo ?? (user.role === 'ADMIN' ? '/admin' : '/cliente'));
    } catch (err) {
      toast.error(extractErrorMessage(err, 'E-mail ou senha inválidos'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-white">Entrar na sua conta</h1>
        <p className="mt-2 text-sm text-slate-400">Acesse para agendar horários e gerenciar seu perfil.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="label" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="voce@exemplo.com"
              {...register('email', { required: 'Informe seu e-mail' })}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label" htmlFor="password">
                Senha
              </label>
              <Link to="/esqueci-senha" className="text-xs font-medium text-brand-blue-400 hover:underline">
                Esqueci minha senha
              </Link>
            </div>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              {...register('password', { required: 'Informe sua senha' })}
            />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro" className="font-medium text-brand-blue-400 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
