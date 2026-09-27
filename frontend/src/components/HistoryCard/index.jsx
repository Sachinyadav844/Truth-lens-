import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'
import RiskBadge from '../RiskBadge'

export default function HistoryCard({ item }) {
  const itemId = item?.id || item?.checkId || ''
  const claimText = item?.claim || 'Untitled claim'
  const confidenceValue = Number(item?.confidence ?? 0)
  const evidenceCount = Number(item?.evidenceCount ?? 0)
  const dateValue = item?.date || item?.createdAt || null

  return (
    <Link to={`/result/${itemId}`} className="truth-card flex items-center justify-between gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-center gap-3">
          <RiskBadge level={item?.risk || 'medium'} />
        </div>
        <h3 className="break-words text-lg font-semibold text-slate-900">{claimText}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-slate-400" /> {evidenceCount} evidence</span>
          <span className="inline-flex items-center gap-1.5"><ShieldAlert className="h-4 w-4 text-slate-400" /> {Math.round(confidenceValue * 100)}% confidence</span>
          <span>{dateValue ? formatDate(dateValue) : 'Date unavailable'}</span>
        </div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  )
}

