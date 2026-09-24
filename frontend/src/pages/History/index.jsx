import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import HistoryCard from '../../components/HistoryCard'
import LoadingState from '../../components/LoadingState'
import ErrorState from '../../components/ErrorState'
import EmptyState from '../../components/EmptyState'
import { mockHistory } from '../../utils/mockData'
import { getHistory } from '../../services/api'

export default function HistoryPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [checks, setChecks] = useState([])

  useEffect(() => {
    getHistory().then(setChecks).catch((requestError) => setError(requestError.message || 'Unable to load your investigations.')).finally(() => setLoading(false))
  }, [])

  const filteredChecks = useMemo(() => {
    const history = checks.length ? checks : mockHistory
    return history.filter((item) => {
      const matchesQuery = item.claim.toLowerCase().includes(query.toLowerCase())
      const matchesRisk = riskFilter === 'all' || item.risk === riskFilter
      return matchesQuery && matchesRisk
    })
  }, [checks, query, riskFilter])

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="page-shell py-10">
        <LoadingState title="Loading history" description="Pulling your prior fact-checks together..." />
      </main>
      <Footer />
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="page-shell py-10">
        <ErrorState title="Unable to load your history" message={error} />
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="page-shell py-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">History</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] text-slate-900">Investigation History</h1>
            <p className="mt-3 max-w-xl text-base text-slate-600">Review the claims you&apos;ve checked previously.</p>
          </div>
        </div>

        <div className="truth-card mb-6 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                className="form-field pl-10"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search previous claims"
              />
            </label>

            <select
              value={riskFilter}
              onChange={(event) => setRiskFilter(event.target.value)}
              className="form-field max-w-[180px]"
              aria-label="Filter checks by risk"
            >
              <option value="all">All risk</option>
              <option value="supported">Supported</option>
              <option value="mixed">Mixed evidence</option>
              <option value="contradicted">Contradicted</option>
            </select>
          </div>
        </div>

        {filteredChecks.length > 0 ? (
          <div className="space-y-4">
            {filteredChecks.map((item) => <HistoryCard key={item.id} item={item} />)}
          </div>
        ) : (
          <EmptyState
            title="No matching claim checks"
            message="Try another search term or switch the risk filter."
            actionLabel="Check your first claim"
            actionTo="/check"
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

