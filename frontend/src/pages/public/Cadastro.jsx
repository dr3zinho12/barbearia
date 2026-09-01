import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';

export default function Cadastro() {
  useDocumentTitle('Criar conta');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone.replace(/\D/g, ''),
        password: data.password,
      });
      toast.success(`Conta criada com sucesso! Bem-vindo(a), ${user.name.split(' ')[0]}!`);
      navigate('/cliente');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Não foi possível concluir o cadastro'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-white">Criar minha conta</h1>
        <p className="mt-2 text-sm text-slate-400">Cadastre-se para agendar horários e acompanhar seu histórico.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="label" htmlFor="name">
              Nome completo
            </label>
            <input
              id="name"
              className="input"
              placeholder="Seu nome"
              {...register('name', { required: 'Informe seu nome', minLength: { value: 3, message: 'Nome muito curto' } })}
            />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="voce@exemplo.com"
              {...register('email', {
                required: 'Informe seu e-mail',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'E-mail inválido' },
              })}
            />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="phone">
              Telefone (DDD + número)
            </label>
            <input
              id="phone"
              className="input"
              placeholder="11987654321"
              {...register('phone', {
                required: 'Informe seu telefone',
                pattern: { value: /^\d{10,11}$/, message: 'Telefone inválido. Use DDD + número, apenas dígitos' },
              })}
            />
            {errors.phone && <p className="field-error">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="label" htmlFor="password">
              Senha
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

          <div>
            <label className="label" htmlFor="confirmPassword">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input"
              placeholder="Repita a senha"
              {...register('confirmPassword', {
                required: 'Confirme sua senha',
                validate: (value) => value === watch('password') || 'As senhas não coincidem',
              })}
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-brand-blue-400 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
