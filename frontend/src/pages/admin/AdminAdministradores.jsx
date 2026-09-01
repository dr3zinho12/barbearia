import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { EmptyState } from '../../components/EmptyState';
import { UserIcon } from '../../components/icons';
import { Modal } from '../../components/Modal';
import { Spinner } from '../../components/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { adminService } from '../../services/admin.service';
import { extractErrorMessage } from '../../services/api';
import { formatDate, formatPhone } from '../../utils/format';

export default function AdminAdministradores() {
  useDocumentTitle('Administradores');
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  function loadAdmins() {
    adminService.listAdmins().then(setAdmins).catch(() => setAdmins([]));
  }

  useEffect(loadAdmins, []);

  function openCreate() {
    reset({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setIsModalOpen(true);
  }

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      await adminService.createAdmin({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      toast.success('Administrador cadastrado com sucesso!');
      setIsModalOpen(false);
      loadAdmins();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Não foi possível cadastrar o administrador'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Administradores</h1>
          <p className="mt-1 text-sm text-slate-400">Gerencie quem tem acesso ao painel administrativo.</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          Novo administrador
        </button>
      </div>

      {admins === null && (
        <div className="mt-10 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {admins?.length === 0 && (
        <div className="mt-10">
          <EmptyState icon={<UserIcon className="h-10 w-10" />} title="Nenhum administrador cadastrado" />
        </div>
      )}

      {admins && admins.length > 0 && (
        <div className="table-shell mt-6">
          <table className="table-base">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Administrador desde</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    {admin.name}
                    {admin.id === currentUser?.id && (
                      <span className="ml-2 rounded-full bg-brand-blue-500/15 px-2 py-0.5 text-xs font-medium text-brand-blue-300">
                        você
                      </span>
                    )}
                  </td>
                  <td>{admin.email}</td>
                  <td>{formatPhone(admin.phone)}</td>
                  <td>{formatDate(admin.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo administrador">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="label" htmlFor="name">
              Nome completo
            </label>
            <input id="name" className="input" {...register('name', { required: 'Informe o nome', minLength: { value: 3, message: 'Nome muito curto' } })} />
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
              {...register('email', {
                required: 'Informe o e-mail',
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
                required: 'Informe o telefone',
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
              {...register('confirmPassword', {
                required: 'Confirme a senha',
                validate: (value) => value === watch('password') || 'As senhas não coincidem',
              })}
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar administrador'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
