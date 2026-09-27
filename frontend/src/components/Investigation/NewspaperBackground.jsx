import { motion } from 'framer-motion'

const articleBlocks = [
  'CLAIM UNDER REVIEW',
  'SOURCE CHECK',
  'EVIDENCE MAP',
  'TRUTHLENS',
]

export default function NewspaperBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute left-[-4%] top-6 h-[52vh] w-[32vw] -rotate-6 rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-[1px]">
          <div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
            <span>TruthLens</span>
            <span>Live</span>
          </div>
          <div className="space-y-4">
            <div className="h-2 w-20 rounded-full bg-slate-300" />
            <div className="h-3 w-32 rounded-full bg-slate-200" />
            <div className="h-3 w-full rounded-full bg-slate-100" />
            <div className="h-3 w-11/12 rounded-full bg-slate-100" />
            <div className="h-3 w-9/12 rounded-full bg-slate-100" />
          </div>
        </div>

        <div className="absolute right-[-4%] top-24 h-[44vh] w-[28vw] rotate-6 rounded-[28px] border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur-[1px]">
          <div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
            <span>Investigation</span>
            <span>Desk</span>
          </div>
          <div className="space-y-4 text-xs text-slate-600">
            <div className="h-8 w-full rounded-lg bg-slate-100 p-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Claim Review</div>
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-slate-100" />
              <div className="h-2 w-11/12 rounded-full bg-slate-100" />
              <div className="h-2 w-10/12 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-x-10 bottom-10 flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-[0.28em] text-slate-300"
        animate={{ opacity: [0.22, 0.4, 0.24] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        {articleBlocks.map((block, index) => (
          <span key={block} className={index % 2 === 0 ? 'block' : 'hidden sm:block'}>{block}</span>
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-200 to-transparent"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
