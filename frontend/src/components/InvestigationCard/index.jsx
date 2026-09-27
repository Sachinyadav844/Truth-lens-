import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'
import RiskBadge from '../RiskBadge'

export default function InvestigationCard({ item, compact = false }) {
  return (
    <Link
      to={`/result/${item.id}`}
      className="group block rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)]"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <RiskBadge level={item.risk} />
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {Math.round((item.confidence || 0) * 100)}% conf.
        </span>
      </div>

      <p className="text-base font-semibold leading-6 tracking-[-0.03em] text-slate-900 sm:text-lg">
        {item.claim}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-slate-400" />
          {item.evidenceCount || 0} evidence
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-slate-400" />
          {item.sources || 0} sources
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500">
        <span>{formatDate(item.date || new Date().toISOString())}</span>
        <span className="inline-flex items-center gap-2 font-semibold text-blue-700">
          View investigation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
