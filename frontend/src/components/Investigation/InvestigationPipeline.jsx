import { motion } from 'framer-motion'
import { CheckCircle2, CircleDashed, Search, Sparkles, ShieldCheck, FileText } from 'lucide-react'

const stages = [
  { id: 'received', label: 'Claim received', icon: FileText },
  { id: 'decompose', label: 'Claim decomposition', icon: Sparkles },
  { id: 'search', label: 'Searching sources', icon: Search },
  { id: 'collect', label: 'Collecting evidence', icon: CircleDashed },
  { id: 'compare', label: 'Comparing evidence', icon: ShieldCheck },
  { id: 'synthesis', label: 'AI synthesis', icon: CheckCircle2 },
]

export default function InvestigationPipeline({ activeIndex = 0, completedCount = 0, loading = false }) {
  const effectiveCompleted = Math.min(completedCount, stages.length)

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Investigation pipeline</p>
          <p className="mt-2 text-lg font-black tracking-[-0.05em] text-slate-900">Evidence review in progress</p>
        </div>
        {loading ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Ready
          </span>
        )}
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const status = index < effectiveCompleted ? 'completed' : index === activeIndex ? 'active' : 'pending'
          const Icon = stage.icon

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${status === 'completed' ? 'bg-emerald-100 text-emerald-700' : status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className={`font-semibold ${status === 'pending' ? 'text-slate-400' : 'text-slate-700'}`}>{stage.label}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${status === 'completed' ? 'text-emerald-700' : status === 'active' ? 'text-blue-700' : 'text-slate-400'}`}>
                    {status}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    className={`h-full rounded-full ${status === 'completed' ? 'bg-emerald-500' : status === 'active' ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-slate-200'}`}
                    initial={{ width: 0 }}
                    animate={{ width: status === 'completed' ? '100%' : status === 'active' ? '72%' : '0%' }}
                    transition={{ duration: 0.45 }}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
