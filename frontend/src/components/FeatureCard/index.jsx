import { ArrowRight } from 'lucide-react'

const accentStyles = {
  blue: 'border-blue-100 bg-blue-50 text-blue-700',
  green: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-100 bg-amber-50 text-amber-700',
  slate: 'border-slate-200 bg-slate-100 text-slate-700',
}

export default function FeatureCard({ title, description, icon: Icon, accent = 'blue' }) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] sm:p-6">
      <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${accentStyles[accent] || accentStyles.blue}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-semibold tracking-[-0.04em] text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
        Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </article>
  )
}
