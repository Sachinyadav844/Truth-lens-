import { ArrowUpRight, BookOpenText, CalendarDays, Newspaper } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'

const iconMap = {
  news: Newspaper,
  government: BookOpenText,
  analysis: BookOpenText,
  default: BookOpenText,
}

export default function SourceCard({ source }) {
  const Icon = iconMap[source?.type] || iconMap.default

  return (
    <article className="truth-card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="break-words text-lg font-semibold text-slate-900">{source?.title || 'Source title unavailable'}</h3>
            <p className="text-sm text-slate-500">{source?.publisher || 'Publisher unavailable'}</p>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
          {source?.type || 'source'}
        </span>
      </div>

      <div className="space-y-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {source?.publishedAt ? formatDate(source.publishedAt) : 'Date unavailable'}
        </div>
        <p>{source?.content || 'No source excerpt is currently available.'}</p>
      </div>

      <a href={source?.url || '#'} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex max-w-full items-center gap-2 break-all text-sm font-semibold text-blue-700 hover:underline">
        Open source <ArrowUpRight className="h-4 w-4" />
      </a>
    </article>
  )
}

