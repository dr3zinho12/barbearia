import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { TagIcon } from '../../components/icons';
import { Modal } from '../../components/Modal';
import { Spinner } from '../../components/Spinner';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { servicesService } from '../../services/services.service';
import { formatCurrency, formatDuration } from '../../utils/format';

export default function AdminServicos() {
  useDocumentTitle('Serviços');
  const [services, setServices] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  function loadServices() {
    servicesService.list().then(setServices).catch(() => setServices([]));
  }

  useEffect(loadServices, []);

  function openCreate() {
    reset({ name: '', description: '', price: 0, duration: 30, active: true });
    setEditingService('new');
  }

  function openEdit(service) {
    reset({ name: service.name, description: service.description, price: Number(service.price), duration: service.duration, active: service.active });
    setEditingService(service);
  }

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      if (editingService && editingService !== 'new') {
        await servicesService.update(editingService.id, data);
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await servicesService.create(data);
        toast.success('Serviço criado com sucesso!');
      }
      setEditingService(null);
      loadServices();
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
      await servicesService.remove(deleteTarget.id);
      toast.success('Serviço removido com sucesso!');
      setDeleteTarget(null);
      loadServices();
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
          <h1 className="text-2xl font-bold text-white">Serviços</h1>
          <p className="mt-1 text-sm text-slate-400">Gerencie os serviços oferecidos pela barbearia.</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          Novo serviço
        </button>
      </div>

      {services === null && (
        <div className="mt-10 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {services?.length === 0 && (
        <div className="mt-10">
          <EmptyState icon={<TagIcon className="h-10 w-10" />} title="Nenhum serviço cadastrado" action={<button type="button" className="btn-primary" onClick={openCreate}>Cadastrar serviço</button>} />
        </div>
      )}

      {services && services.length > 0 && (
        <div className="table-shell mt-6">
          <table className="table-base">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Duração</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <p className="font-medium text-white">{service.name}</p>
                    <p className="text-xs text-slate-500">{service.description}</p>
                  </td>
                  <td>{formatCurrency(service.price)}</td>
                  <td>{formatDuration(service.duration)}</td>
                  <td>
                    <span className={service.active ? 'text-emerald-400' : 'text-slate-500'}>
                      {service.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-3">
                      <button type="button" className="font-medium text-brand-blue-400 hover:underline" onClick={() => openEdit(service)}>
                        Editar
                      </button>
                      <button type="button" className="font-medium text-red-400 hover:underline" onClick={() => setDeleteTarget(service)}>
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!editingService}
        onClose={() => setEditingService(null)}
        title={editingService === 'new' ? 'Novo serviço' : 'Editar serviço'}
      >
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="price">Preço (R$)</label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className="input"
                {...register('price', { required: 'Informe o preço', valueAsNumber: true, min: { value: 0.01, message: 'Preço inválido' } })}
              />
              {errors.price && <p className="field-error">{errors.price.message}</p>}
            </div>
            <div>
              <label className="label" htmlFor="duration">Duração (minutos)</label>
              <input
                id="duration"
                type="number"
                min="5"
                step="5"
                className="input"
                {...register('duration', { required: 'Informe a duração', valueAsNumber: true, min: { value: 5, message: 'Duração inválida' } })}
              />
              {errors.duration && <p className="field-error">{errors.duration.message}</p>}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="h-4 w-4 rounded border-brand-border bg-brand-night" {...register('active')} />
            Serviço ativo
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-ghost" onClick={() => setEditingService(null)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Excluir serviço"
        description={`Tem certeza de que deseja excluir "${deleteTarget?.name}"? Se houver agendamentos vinculados, o serviço será apenas desativado.`}
        confirmLabel="Excluir"
        danger
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
