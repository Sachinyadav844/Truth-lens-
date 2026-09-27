import { ArrowUpRight, Quote } from 'lucide-react'

const toneMap = {
  supporting: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  contradicting: 'border-rose-200 bg-rose-50 text-rose-700',
  unclear: 'border-amber-200 bg-amber-50 text-amber-700',
}

function isSafeUrl(value) {
  if (!value || typeof value !== 'string') return false
  try {
    const parsed = new URL(value)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch (error) {
    return false
  }
}

export default function EvidenceCard({ item, category = 'supporting' }) {
  if (!item) return null

  const safeUrl = isSafeUrl(item.sourceUrl) ? item.sourceUrl : ''

  return (
    <article className={`rounded-2xl border p-5 ${toneMap[category] || toneMap.supporting}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
          <Quote className="h-3.5 w-3.5" />
          {category}
        </div>
        <div className="rounded-full bg-white/70 px-2 py-1 text-xs font-medium text-slate-700">
          {Math.round(Number(item.confidence || 0) * 100)}% confidence
        </div>
      </div>

      <p className="break-words text-base font-medium text-slate-900">{item.statement || 'Evidence statement unavailable.'}</p>
      <p className="mt-3 break-words text-sm text-slate-700">{item.reason || 'No explanation was supplied.'}</p>

      <div className="mt-5 space-y-2 border-t border-slate-200/80 pt-4 text-sm text-slate-600">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <span className="font-medium text-slate-700">Sub-claim</span>
          <span className="min-w-0 break-words sm:text-right">{item.subClaim || 'Not specified'}</span>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <span className="font-medium text-slate-700">Source</span>
          {safeUrl ? (
            <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-0 break-words items-start gap-1 text-blue-700 hover:underline sm:justify-end">
              <span>{item.sourceTitle || 'Source unavailable'}</span> <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            </a>
          ) : (
            <span className="min-w-0 break-words text-slate-600 sm:text-right">{item.sourceTitle || 'Source unavailable'}</span>
          )}
        </div>
      </div>
    </article>
  )
}

