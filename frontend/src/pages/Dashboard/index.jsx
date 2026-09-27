import { ArrowRight, BarChart3, History, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import HistoryCard from '../../components/HistoryCard'
import { useAuth } from '../../context/AuthContext'
import { getHistory } from '../../services/api'
import LoadingState from '../../components/LoadingState'
import ErrorState from '../../components/ErrorState'
import { mapHistoryResponse } from '../../utils/mappers'

export default function DashboardPage() {
  const { user } = useAuth()
  const [checks, setChecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError('')
    getHistory()
      .then((history) => setChecks(mapHistoryResponse(history)))
      .catch((requestError) => setError(requestError.message || 'Unable to load recent investigations.'))
      .finally(() => setLoading(false))
  }, [reload])

  const recentChecks = useMemo(() => checks.slice(0, 3), [checks])
  const displayName = user?.name || 'there'

  const stats = useMemo(() => {
    const total = checks.length
    const high = checks.filter((item) => item.risk === 'high').length
    const medium = checks.filter((item) => item.risk === 'medium').length
    const low = checks.filter((item) => item.risk === 'low').length

    return [
      { label: 'Total checks', value: total, delta: total ? 'Live data' : 'No investigations yet' },
      { label: 'High risk', value: high, delta: 'High' },
      { label: 'Medium risk', value: medium, delta: 'Medium' },
      { label: 'Low risk', value: low, delta: 'Low' },
    ]
  }, [checks])

  const coveragePercent = checks.length
    ? Math.min(100, Math.round((checks.reduce((total, item) => total + Number(item.evidenceCount || 0), 0) / Math.max(checks.length, 1)) * 10))
    : 0

  if (loading) return <><Navbar /><main className="page-shell py-10"><LoadingState title="Loading dashboard" description="Preparing your recent investigations..." /></main><Footer /></>
  if (error) return <><Navbar /><main className="page-shell py-10"><ErrorState title="Dashboard unavailable" message={error} onRetry={() => setReload((current) => current + 1)} /></main><Footer /></>

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="page-shell py-10">
        <section className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Dashboard</p>
            <h1 className="mt-3 break-words text-4xl font-black tracking-[-0.07em] text-slate-900">Good to see you, {displayName.split(' ')[0]}.</h1>
            <p className="mt-3 max-w-xl text-base text-slate-600">Review your recent investigations or start a new claim check.</p>
          </div>
          <Link to="/check" className="btn-primary">
            Check a claim <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </section>

        <section className="grid gap-5 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <div className="mt-4 flex items-end justify-between">
                <h2 className="text-4xl font-black tracking-[-0.06em] text-slate-900">{stat.value}</h2>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{stat.delta}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-[-0.06em] text-slate-900">Recent checks</h2>
              <Link to="/history" className="text-sm font-semibold text-blue-700">View all</Link>
            </div>
            <div className="space-y-4">
              {recentChecks.length > 0 ? (
                recentChecks.map((item) => <HistoryCard key={item.id} item={item} />)
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">No recent investigations.</div>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="truth-card p-5">
              <h3 className="text-xl font-bold text-slate-900">Quick actions</h3>
              <div className="mt-4 space-y-3">
                <Link to="/check" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <span className="inline-flex items-center gap-2"><Search className="h-4 w-4" /> New claim</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/history" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                  <span className="inline-flex items-center gap-2"><History className="h-4 w-4" /> View cases</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {recentChecks[0] && (
                  <Link to={`/result/${recentChecks[0].id}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                    <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Latest result</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            <div className="truth-card bg-[#f7faff] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Evidence tracker</h3>
                  <p className="text-sm text-slate-500">Rigor before confidence.</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3 rounded-xl bg-white p-3">
                <BarChart3 className="h-5 w-5 text-blue-700" />
                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Cross-source coverage</span>
                    <span>{coveragePercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${coveragePercent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}

