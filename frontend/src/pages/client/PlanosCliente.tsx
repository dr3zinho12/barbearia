import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Spinner } from '../../components/Spinner';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { plansService } from '../../services/plans.service';
import { Plan, Subscription } from '../../types';
import { formatCurrency } from '../../utils/format';

export default function PlanosCliente() {
  useDocumentTitle('Meus planos');
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null | undefined>(undefined);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  function loadData() {
    plansService.list().then(setPlans).catch(() => setPlans([]));
    plansService.getCurrentSubscription().then(setSubscription).catch(() => setSubscription(null));
  }

  useEffect(loadData, []);

  async function handleSubscribe(plan: Plan) {
    setSubscribingId(plan.id);
    try {
      await plansService.subscribe(plan.id);
      toast.success(`Plano ${plan.name} assinado com sucesso!`);
      loadData();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubscribingId(null);
    }
  }

  async function handleCancelSubscription() {
    setIsCancelling(true);
    try {
      await plansService.cancelSubscription();
      toast.success('Assinatura cancelada com sucesso.');
      setIsCancelDialogOpen(false);
      loadData();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsCancelling(false);
    }
  }

  const isLoading = plans === null || subscription === undefined;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Planos</h1>
      <p className="mt-1 text-sm text-slate-400">Escolha o plano ideal e aproveite benefícios exclusivos.</p>

      {isLoading && (
        <div className="mt-10 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {!isLoading && subscription && (
        <div className="card mt-8 flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue-400">Plano atual</p>
            <p className="mt-1 text-xl font-bold text-white">{subscription.plan?.name}</p>
            <p className="text-sm text-slate-400">{formatCurrency(subscription.plan?.price ?? 0)}/mês</p>
          </div>
          <button type="button" className="btn-danger" onClick={() => setIsCancelDialogOpen(true)}>
            Cancelar assinatura
          </button>
        </div>
      )}

      {!isLoading && (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {plans?.map((plan) => {
            const isCurrent = subscription?.planId === plan.id;
            return (
              <div key={plan.id} className={`card flex flex-col p-8 ${isCurrent ? 'border-brand-blue-500/60' : ''}`}>
                {isCurrent && (
                  <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand-blue-500 px-3 py-1 text-xs font-semibold text-white">
                    Seu plano
                  </span>
                )}
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
                <p className="mt-6 text-3xl font-bold text-brand-blue-400">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-medium text-slate-500">/mês</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-0.5 text-brand-blue-400">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={isCurrent || subscribingId === plan.id}
                  onClick={() => handleSubscribe(plan)}
                  className={isCurrent ? 'btn-secondary mt-8 w-full' : 'btn-primary mt-8 w-full'}
                >
                  {isCurrent ? 'Plano ativo' : subscribingId === plan.id ? 'Processando...' : 'Assinar plano'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        title="Cancelar assinatura"
        description="Tem certeza de que deseja cancelar sua assinatura atual?"
        confirmLabel="Sim, cancelar"
        danger
        isLoading={isCancelling}
        onConfirm={handleCancelSubscription}
        onCancel={() => setIsCancelDialogOpen(false)}
      />
    </div>
  );
}
