import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function EmptyState({
  title = 'No items yet',
  message = 'Nothing is available right now.',
  actionLabel,
  actionTo = '/check',
}) {
  return (
    <div className="truth-card p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      {actionLabel ? (
        <Link to={actionTo} className="btn-primary mt-6 inline-flex">
          {actionLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}
