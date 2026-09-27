import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-white">
      <div className="page-shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-3 text-2xl font-black tracking-[-0.08em]">
              <span className="text-slate-900">Truth</span>
              <span className="text-[#2563eb]">Lens</span>
            </div>
            <p className="max-w-sm text-sm text-slate-600">
              Evidence before conclusions. Investigate claims with transparent sources and visible uncertainty.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Product</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/check">Check a claim</Link></li>
              <li><Link to="/history">History</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><Link to="/#how-it-works">How it works</Link></li>
              <li><Link to="/#features">Evidence</Link></li>
              <li><Link to="/#about">Sources & trust</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><span className="text-slate-400">Privacy policy pending</span></li>
              <li><span className="text-slate-400">Terms pending</span></li>
              <li><span className="text-slate-400">Cookies pending</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 TruthLens. All rights reserved.</p>
          <p>Evidence-first analysis, without fabricated certainty.</p>
        </div>
      </div>
    </footer>
  )
}

