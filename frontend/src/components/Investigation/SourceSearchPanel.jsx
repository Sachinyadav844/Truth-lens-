import { motion } from 'framer-motion'
import { ArrowUpRight, BookOpenText, Newspaper, Search, Sparkles } from 'lucide-react'

const sourceCards = [
  { label: 'News sources', tone: 'bg-blue-50 text-blue-700', icon: Newspaper },
  { label: 'Wikipedia references', tone: 'bg-slate-100 text-slate-700', icon: BookOpenText },
  { label: 'External reports', tone: 'bg-amber-50 text-amber-700', icon: Search },
]

export default function SourceSearchPanel() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Search status</p>
          <h3 className="mt-2 text-lg font-black tracking-[-0.05em] text-slate-900">Scanning independent sources</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-3">
        {sourceCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700">{card.label}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Searching…</p>
                </div>
              </div>

              <div className="relative h-2.5 w-14 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                  animate={{ x: ['0%', '120%', '0%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.15 }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs uppercase tracking-[0.22em] text-slate-500">
        Source collection remains neutral and traceable.
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Cross-checking results</span>
        <span className="inline-flex items-center gap-1 text-blue-700">
          Review <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  )
}
