const styles = {
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  medium: 'border-amber-200 bg-amber-50 text-amber-700',
  high: 'border-rose-200 bg-rose-50 text-rose-700',
  mixed: 'border-sky-200 bg-sky-50 text-sky-700',
  supported: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  contradicted: 'border-rose-200 bg-rose-50 text-rose-700',
}

const labels = {
  low: 'Low risk',
  medium: 'Medium risk',
  high: 'High risk',
  mixed: 'Mixed evidence',
  supported: 'Supported',
  contradicted: 'Contradicted',
}

export default function RiskBadge({ level = 'low', className = '' }) {
  const key = String(level).toLowerCase()
  const tone = styles[key] || styles.low
  const label = labels[key] || labels.low

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone} ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  )
}

