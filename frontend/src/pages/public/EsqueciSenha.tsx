import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { authService } from '../../services/auth.service';

interface ForgotForm {
  email: string;
}

export default function EsqueciSenha() {
  useDocumentTitle('Recuperar senha');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>();

  async function onSubmit(data: ForgotForm) {
    setIsSubmitting(true);
    try {
      const response = await authService.forgotPassword(data.email);
      setMessage(response.message);
      if (response.resetToken) {
        // Projeto acadêmico sem envio real de e-mail: o token é encaminhado
        // diretamente para a tela de redefinição para permitir a demonstração.
        toast.success('Link de recuperação gerado (modo demonstração).');
        navigate(`/redefinir-senha?token=${response.resetToken}`);
      }
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-white">Recuperar senha</h1>
        <p className="mt-2 text-sm text-slate-400">
          Informe seu e-mail cadastrado para receber as instruções de redefinição de senha.
        </p>

        {message ? (
          <div className="mt-6 rounded-xl border border-brand-blue-500/30 bg-brand-blue-500/10 p-4 text-sm text-brand-blue-200">
            {message}
          </div>
        ) : (
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

            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          Lembrou sua senha?{' '}
          <Link to="/login" className="font-medium text-brand-blue-400 hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
