import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { extractErrorMessage } from '../../services/api';
import { plansService } from '../../services/plans.service';
import { Plan } from '../../types';
import { formatCurrency } from '../../utils/format';

export default function Planos() {
  useDocumentTitle('Planos');
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState(false);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    plansService
      .list()
      .then(setPlans)
      .catch(() => setError(true));
  }, []);

  async function handleSubscribe(plan: Plan) {
    if (!user) {
      toast('Crie sua conta ou entre para assinar um plano.');
      navigate('/cadastro');
      return;
    }

    if (user.role !== 'CLIENT') {
      toast.error('Apenas clientes podem assinar planos.');
      return;
    }

    setSubscribingId(plan.id);
    try {
      await plansService.subscribe(plan.id);
      toast.success(`Plano ${plan.name} assinado com sucesso!`);
      navigate('/cliente/planos');
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubscribingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-title">Planos da barbearia</h1>
        <p className="section-subtitle mx-auto">
          Economize e garanta atendimento prioritário com nossos planos mensais.
        </p>
      </div>

      {plans === null && !error && (
        <div className="mt-16 flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <div className="mt-16">
          <EmptyState title="Não foi possível carregar os planos" description="Verifique sua conexão e tente novamente." />
        </div>
      )}

      {plans?.length === 0 && (
        <div className="mt-16">
          <EmptyState title="Nenhum plano disponível no momento" description="Volte em breve para conferir nossos planos." />
        </div>
      )}

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans?.map((plan, index) => (
          <div
            key={plan.id}
            className={`card flex flex-col p-8 ${index === 1 ? 'border-brand-blue-500/60 shadow-glow lg:-translate-y-2' : ''}`}
          >
            {index === 1 && (
              <span className="mb-4 inline-flex w-fit items-center rounded-full bg-brand-blue-500 px-3 py-1 text-xs font-semibold text-white">
                Mais popular
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
              onClick={() => handleSubscribe(plan)}
              disabled={subscribingId === plan.id}
              className={`mt-8 w-full ${index === 1 ? 'btn-primary' : 'btn-secondary'}`}
            >
              {subscribingId === plan.id ? 'Processando...' : 'Assinar plano'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
