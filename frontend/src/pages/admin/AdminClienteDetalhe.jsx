import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { StatusBadge } from '../../components/StatusBadge';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { adminService } from '../../services/admin.service';
import { extractErrorMessage } from '../../services/api';
import { formatCurrency, formatDate, formatPhone } from '../../utils/format';

export default function AdminClienteDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useDocumentTitle(client ? client.name : 'Cliente');

  function loadClient() {
    if (!id) return;
    adminService
      .getClient(id)
      .then(setClient)
      .catch(() => {
        toast.error('Cliente não encontrado');
        navigate('/admin/clientes');
      });
  }

  useEffect(loadClient, [id]);

  async function handleToggleActive() {
    if (!client) return;
    setIsSubmitting(true);
    try {
      await adminService.updateClient(client.id, { active: !client.active });
      toast.success(client.active ? 'Cliente desativado com sucesso.' : 'Cliente reativado com sucesso.');
      setIsToggleDialogOpen(false);
      loadClient();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!client) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <Link to="/admin/clientes" className="text-sm text-brand-blue-400 hover:underline">
        ← Voltar para clientes
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">{client.name}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {client.email} · {formatPhone(client.phone)}
          </p>
        </div>
        <button type="button" className={client.active ? 'btn-danger' : 'btn-primary'} onClick={() => setIsToggleDialogOpen(true)}>
          {client.active ? 'Desativar cliente' : 'Reativar cliente'}
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-white">Plano contratado</h2>
          {client.subscription ? (
            <div className="mt-4">
              <p className="text-xl font-bold text-brand-blue-400">{client.subscription.plan?.name}</p>
              <p className="mt-1 text-sm text-slate-400">{formatCurrency(client.subscription.plan?.price ?? 0)}/mês</p>
              <StatusBadge status={client.subscription.status} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">Este cliente não possui um plano ativo.</p>
          )}
        </div>

        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Resumo</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Cliente desde</dt>
              <dd className="mt-1 font-medium text-white">{formatDate(client.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Total de agendamentos</dt>
              <dd className="mt-1 font-medium text-white">{client.appointments.length}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className={`mt-1 font-medium ${client.active ? 'text-emerald-400' : 'text-slate-400'}`}>
                {client.active ? 'Ativo' : 'Inativo'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <h2 className="text-lg font-semibold text-white">Histórico de agendamentos</h2>
        {client.appointments.length === 0 && (
          <div className="mt-4">
            <EmptyState title="Nenhum agendamento registrado" />
          </div>
        )}
        {client.appointments.length > 0 && (
          <div className="table-shell mt-4">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Serviço</th>
                  <th>Barbeiro</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {client.appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{formatDate(appointment.date)} · {appointment.startTime}</td>
                    <td>{appointment.service?.name}</td>
                    <td>{appointment.barber?.name}</td>
                    <td>
                      <StatusBadge status={appointment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isToggleDialogOpen}
        title={client.active ? 'Desativar cliente' : 'Reativar cliente'}
        description={
          client.active
            ? 'O cliente não poderá mais acessar a plataforma até ser reativado.'
            : 'O cliente voltará a ter acesso normal à plataforma.'
        }
        confirmLabel={client.active ? 'Desativar' : 'Reativar'}
        danger={client.active}
        isLoading={isSubmitting}
        onConfirm={handleToggleActive}
        onCancel={() => setIsToggleDialogOpen(false)}
      />
    </div>
  );
}
