import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import EvidenceCard from '../../components/EvidenceCard'
import RiskBadge from '../../components/RiskBadge'
import SourceCard from '../../components/SourceCard'
import { mockResult } from '../../utils/mockData'
import { getResult } from '../../services/api'
import LoadingState from '../../components/LoadingState'
import ErrorState from '../../components/ErrorState'

const tabs = ['supporting', 'contradicting', 'unclear']

export default function ResultPage() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('supporting')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getResult(id || mockResult.checkId).then(setResult).catch((requestError) => setError(requestError.message || 'Unable to load this investigation.')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <><Navbar /><main className="page-shell py-10"><LoadingState title="Loading investigation" description="Assembling the claim and its evidence..." /></main><Footer /></>
  if (error || !result) return <><Navbar /><main className="page-shell py-10"><ErrorState title="Investigation unavailable" message={error || 'No result was returned.'} /></main><Footer /></>

  const tabData = result.evidence[activeTab] || []

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="page-shell py-10">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <section className="mt-6 truth-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Claim</p>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.07em] text-slate-900 sm:text-4xl">{result.claim.original}</h1>
              <p className="mt-4 text-base text-slate-600">
                <span className="font-semibold text-slate-700">Normalized claim:</span> {result.claim.normalized}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:min-w-[260px]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Overall assessment</p>
              <div className="mt-3 flex items-center gap-3">
                <RiskBadge level={result.assessment.riskLevel} />
              </div>
              <div className="mt-5 flex items-center justify-between text-sm font-medium text-slate-600">
                <span>Confidence</span>
                <span className="text-xl font-black text-slate-900">{result.assessment.confidence.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 truth-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-blue-700" />
            <h2 className="text-2xl font-black tracking-[-0.06em] text-slate-900">AI summary</h2>
          </div>
          <p className="text-lg leading-8 text-slate-700">{result.assessment.summary}</p>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="truth-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-blue-700" />
              <h2 className="text-2xl font-black tracking-[-0.06em] text-slate-900">Evidence</h2>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold capitalize transition ${
                    activeTab === tab
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {tabData.length > 0 ? (
                tabData.map((item) => <EvidenceCard key={item.id} item={item} category={activeTab} />)
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                  No evidence is available in this category yet.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="truth-card p-6">
              <h2 className="text-2xl font-black tracking-[-0.06em] text-slate-900">Sources</h2>
              <div className="mt-5 space-y-4">
                {result.sources.map((source) => <SourceCard key={source.sourceId} source={source} />)}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 truth-card p-6">
          <h2 className="text-2xl font-black tracking-[-0.06em] text-slate-900">Suggested verification</h2>
          <ul className="mt-5 space-y-3 text-base text-slate-700">
            {result.suggestedVerification.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  )
}

