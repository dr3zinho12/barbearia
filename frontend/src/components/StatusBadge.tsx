import { statusLabel } from '../utils/format';

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  CONFIRMED: 'bg-brand-blue-500/20 text-brand-blue-300 border-brand-blue-500/40',
  COMPLETED: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  CANCELED: 'bg-red-500/15 text-red-300 border-red-500/30',
  NO_SHOW: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  ACTIVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  EXPIRED: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? 'bg-slate-500/15 text-slate-300 border-slate-500/30';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}>
      {statusLabel(status)}
    </span>
  );
}
