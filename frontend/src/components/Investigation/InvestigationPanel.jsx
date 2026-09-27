import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'

const formatLabel = (value) => {
  if (!value && value !== 0) return 'N/A'
  return String(value)
}

export default function InvestigationPanel({ claim, result, loading, statusText }) {
  return (
    <div className="rounded-[30px] border border-slate-200 bg-white/85 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-slate-500">Claim under investigation</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.06em] text-slate-900 sm:text-3xl">{formatLabel(claim) || 'Claim unavailable'}</h2>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">{statusText}</span>
            {result?.checkId ? <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">Investigation ID: {result.checkId}</span> : null}
          </div>
        </div>

        <div className="rounded-[24px] border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {loading ? 'Processing claim' : 'Review complete'}
          </div>
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-5 grid gap-3 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Support
            </div>
            <p className="mt-2 text-2xl font-black tracking-[-0.06em] text-slate-900">{result.evidence?.supporting?.length || 0}</p>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5" />
              Contradict
            </div>
            <p className="mt-2 text-2xl font-black tracking-[-0.06em] text-slate-900">{result.evidence?.contradicting?.length || 0}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Unclear
            </div>
            <p className="mt-2 text-2xl font-black tracking-[-0.06em] text-slate-900">{result.evidence?.unclear?.length || 0}</p>
          </div>
        </motion.div>
      )}

      <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">
        <ArrowRight className="h-4 w-4 text-blue-700" />
        {loading ? 'TruthLens is actively checking the claim across sources.' : 'The evidence review is ready to inspect.'}
      </div>
    </div>
  )
}
