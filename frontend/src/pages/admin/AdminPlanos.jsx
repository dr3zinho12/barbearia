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
import { plansService } from '../../services/plans.service';
import { formatCurrency } from '../../utils/format';

function SubscribersModal({ plan, onClose }) {
  const [subscribers, setSubscribers] = useState(null);

  useEffect(() => {
    plansService.listSubscribers(plan.id).then(setSubscribers).catch(() => setSubscribers([]));
  }, [plan.id]);

  return (
    <Modal isOpen onClose={onClose} title={`Assinantes de ${plan.name}`}>
      {subscribers === null && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}
      {subscribers?.length === 0 && <EmptyState title="Nenhum assinante neste plano" />}
      {subscribers && subscribers.length > 0 && (
        <ul className="space-y-2">
          {subscribers.map((subscription) => (
            <li key={subscription.id} className="flex items-center justify-between rounded-lg border border-brand-border bg-brand-night p-3">
              <div>
                <p className="text-sm font-medium text-white">{subscription.client?.name}</p>
                <p className="text-xs text-slate-500">{subscription.client?.email}</p>
              </div>
              <span className={subscription.status === 'ACTIVE' ? 'text-xs font-medium text-emerald-400' : 'text-xs font-medium text-slate-500'}>
                {subscription.status === 'ACTIVE' ? 'Ativa' : 'Encerrada'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

export default function AdminPlanos() {
  useDocumentTitle('Planos');
  const [plans, setPlans] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [subscribersPlan, setSubscribersPlan] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  function loadPlans() {
    plansService.list().then(setPlans).catch(() => setPlans([]));
  }

  useEffect(loadPlans, []);

  function openCreate() {
    reset({ name: '', description: '', price: 0, benefits: '', active: true });
    setEditingPlan('new');
  }

  function openEdit(plan) {
    reset({ name: plan.name, description: plan.description, price: Number(plan.price), benefits: plan.benefits.join('\n'), active: plan.active });
    setEditingPlan(plan);
  }

  async function onSubmit(data) {
    setIsSubmitting(true);
    const payload = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      benefits: data.benefits.split('\n').map((b) => b.trim()).filter(Boolean),
      active: data.active,
    };

    try {
      if (editingPlan && editingPlan !== 'new') {
        await plansService.update(editingPlan.id, payload);
        toast.success('Plano atualizado com sucesso!');
      } else {
        await plansService.create(payload);
        toast.success('Plano criado com sucesso!');
      }
      setEditingPlan(null);
      loadPlans();
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
      await plansService.remove(deleteTarget.id);
      toast.success('Plano removido com sucesso!');
      setDeleteTarget(null);
      loadPlans();
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
          <h1 className="text-2xl font-bold text-white">Planos</h1>
          <p className="mt-1 text-sm text-slate-400">Gerencie os planos de assinatura da barbearia.</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          Novo plano
        </button>
      </div>

      {plans === null && (
        <div className="mt-10 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {plans?.length === 0 && (
        <div className="mt-10">
          <EmptyState icon={<TagIcon className="h-10 w-10" />} title="Nenhum plano cadastrado" action={<button type="button" className="btn-primary" onClick={openCreate}>Cadastrar plano</button>} />
        </div>
      )}

      {plans && plans.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="card p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-white">{plan.name}</h3>
                <span className={plan.active ? 'text-xs font-medium text-emerald-400' : 'text-xs font-medium text-slate-500'}>
                  {plan.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="mt-2 text-xl font-bold text-brand-blue-400">{formatCurrency(plan.price)}<span className="text-xs font-medium text-slate-500">/mês</span></p>
              <ul className="mt-3 space-y-1 text-xs text-slate-400">
                {plan.benefits.slice(0, 3).map((benefit) => (
                  <li key={benefit}>• {benefit}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <button type="button" className="font-medium text-brand-blue-400 hover:underline" onClick={() => openEdit(plan)}>
                  Editar
                </button>
                <button type="button" className="font-medium text-brand-blue-400 hover:underline" onClick={() => setSubscribersPlan(plan)}>
                  Assinantes
                </button>
                <button type="button" className="font-medium text-red-400 hover:underline" onClick={() => setDeleteTarget(plan)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!editingPlan} onClose={() => setEditingPlan(null)} title={editingPlan === 'new' ? 'Novo plano' : 'Editar plano'}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="label" htmlFor="name">Nome</label>
            <input id="name" className="input" {...register('name', { required: 'Informe o nome' })} />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="description">Descrição</label>
            <textarea id="description" className="input min-h-[60px]" {...register('description', { required: 'Informe a descrição' })} />
            {errors.description && <p className="field-error">{errors.description.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="price">Preço mensal (R$)</label>
            <input id="price" type="number" step="0.01" min="0" className="input" {...register('price', { required: 'Informe o preço', valueAsNumber: true, min: { value: 0.01, message: 'Preço inválido' } })} />
            {errors.price && <p className="field-error">{errors.price.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="benefits">Benefícios (um por linha)</label>
            <textarea id="benefits" className="input min-h-[100px]" placeholder={'2 cortes por mês\nAgendamento prioritário'} {...register('benefits', { required: 'Informe ao menos um benefício' })} />
            {errors.benefits && <p className="field-error">{errors.benefits.message}</p>}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" className="h-4 w-4 rounded border-brand-border bg-brand-night" {...register('active')} />
            Plano ativo
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-ghost" onClick={() => setEditingPlan(null)}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </Modal>

      {subscribersPlan && <SubscribersModal plan={subscribersPlan} onClose={() => setSubscribersPlan(null)} />}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Excluir plano"
        description={`Tem certeza de que deseja excluir "${deleteTarget?.name}"? Se houver assinantes vinculados, o plano será apenas desativado.`}
        confirmLabel="Excluir"
        danger
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
