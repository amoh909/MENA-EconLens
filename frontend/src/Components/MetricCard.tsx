interface MetricCardProps {
  label: string;
  value: string;
  helper?: string;
  status?: string;
  statusClassName?: string;
}

export default function MetricCard({
  label,
  value,
  helper,
  status,
  statusClassName = "text-slate-300",
}: MetricCardProps) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-2xl font-bold tracking-tight text-slate-100">
          {value}
        </p>

        {status && (
          <span
            className={`rounded-full bg-slate-950 px-2.5 py-1 text-xs font-medium ${statusClassName}`}
          >
            {status}
          </span>
        )}
      </div>

      {helper && (
        <p className="mt-2 text-xs text-slate-500">
          {helper}
        </p>
      )}
    </article>
  );
}