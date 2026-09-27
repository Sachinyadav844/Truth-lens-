import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'

function formatConfidence(value) {
  if (value === null || value === undefined || value === '') return 'N/A'
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 'N/A'
  return `${Math.round(numeric * 100)}%`
}

export default function InvestigationResult({ result }) {
  if (!result) return null

  const evidence = result.evidence || { supporting: [], contradicting: [], unclear: [] }
  const supporting = evidence.supporting?.length || 0
  const contradicting = evidence.contradicting?.length || 0
  const unclear = evidence.unclear?.length || 0
  const confidence = formatConfidence(result.assessment?.confidence)
  const risk = result.assessment?.riskLevel || 'medium'
  const summary = result.assessment?.summary || 'No neutral summary was returned.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.04)] sm:p-6"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-500">Final assessment</p>
          <h3 className="mt-3 text-3xl font-black tracking-[-0.07em] text-slate-900">Claim assessment</h3>
          <p className="mt-4 text-lg leading-8 text-slate-700">{summary}</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 lg:min-w-[220px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Risk</span>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${risk === 'high' ? 'bg-rose-100 text-rose-700' : risk === 'low' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {risk}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-sm text-slate-500">Confidence</span>
            <span className="text-2xl font-black tracking-[-0.06em] text-slate-900">{confidence}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Supporting
          </div>
          <p className="mt-3 text-3xl font-black tracking-[-0.07em] text-slate-900">{supporting}</p>
        </div>
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-rose-700">
            <AlertTriangle className="h-4 w-4" />
            Contradicting
          </div>
          <p className="mt-3 text-3xl font-black tracking-[-0.07em] text-slate-900">{contradicting}</p>
        </div>
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
            <Sparkles className="h-4 w-4" />
            Unclear
          </div>
          <p className="mt-3 text-3xl font-black tracking-[-0.07em] text-slate-900">{unclear}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ShieldCheck className="h-4 w-4 text-blue-700" />
          Evidence balance
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-slate-200">
          <div className="absolute inset-y-0 left-0 flex h-full w-full">
            <div className="h-full bg-emerald-500" style={{ width: `${Math.max(6, supporting * 30)}%` }} />
            <div className="h-full bg-rose-500" style={{ width: `${Math.max(6, contradicting * 30)}%` }} />
            <div className="h-full bg-amber-500" style={{ width: `${Math.max(6, unclear * 30)}%` }} />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          <span>supporting</span>
          <span>contradicting</span>
          <span>unclear</span>
        </div>
      </div>

      {Array.isArray(result.suggestedVerification) && result.suggestedVerification.length > 0 && (
        <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ArrowRight className="h-4 w-4 text-blue-700" />
            Suggested verification
          </div>
          <ul className="space-y-3 text-sm text-slate-600">
            {result.suggestedVerification.map((item) => (
              <li key={item} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}
