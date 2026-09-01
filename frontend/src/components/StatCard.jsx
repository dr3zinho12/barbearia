export function StatCard({ label, value, icon, hint }) {
  return (
    <div className="card flex items-start justify-between p-5">
      <div>
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      </div>
      {icon && <div className="rounded-xl bg-brand-blue-500/10 p-3 text-brand-blue-400">{icon}</div>}
    </div>
  );
}
