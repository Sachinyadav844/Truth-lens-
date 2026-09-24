import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'
import RiskBadge from '../RiskBadge'

export default function HistoryCard({ item }) {
  return (
    <Link to={`/result/${item.id}`} className="truth-card flex items-center justify-between gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-center gap-3">
          <RiskBadge level={item.risk} />
        </div>
        <h3 className="truncate text-lg font-semibold text-slate-900">{item.claim}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-slate-400" /> {item.evidenceCount} evidence</span>
          <span className="inline-flex items-center gap-1.5"><ShieldAlert className="h-4 w-4 text-slate-400" /> {item.confidence.toFixed(2)} confidence</span>
          <span>{formatDate(item.date)}</span>
        </div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  )
}

