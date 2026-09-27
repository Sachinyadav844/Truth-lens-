import { useState } from 'react'
import { CheckCheck, FileSearch, LoaderCircle, SearchCheck, Sparkles } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ClaimInput from '../../components/ClaimInput'
import { exampleClaims } from '../../utils/mockData'
import { useClaimCheck } from '../../hooks/useClaimCheck'

export default function CheckPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [claim, setClaim] = useState(location.state?.claim || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { run } = useClaimCheck()

  const validateClaim = (value) => {
    const trimmed = value.trim()

    if (!trimmed) return 'Enter a specific factual claim to investigate.'
    if (trimmed.length < 8) return 'Enter a specific factual claim to investigate.'
    if (trimmed.length > 2000) return 'Claim is too long. Keep the statement concise and factual.'
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationMessage = validateClaim(claim)

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setError('')
    setLoading(true)

    const result = await run(claim.trim())

    if (result?.checkId) {
      navigate(`/result/${result.checkId}`)
      return
    }

    setError('We could not complete this investigation. Please try again.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="page-shell py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 sm:mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">New investigation</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.07em] text-slate-900 sm:text-4xl lg:text-5xl">
              What claim would you like to investigate?
            </h1>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_50px_rgba(15,23,42,0.04)] sm:p-6 lg:p-7">
            {!loading ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-2 sm:p-3">
                  <ClaimInput
                    value={claim}
                    onChange={(event) => setClaim(event.target.value)}
                    onSubmit={handleSubmit}
                    placeholder="Paste a claim, headline, statistic, or statement to investigate..."
                    examples={exampleClaims}
                    buttonLabel="Analyze Claim"
                    loading={false}
                  />
                </div>
                <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                  <p className={claim.trim().length > 2000 ? 'text-rose-600' : ''}>{claim.length}/2000 characters</p>
                  <button
                    type="button"
                    onClick={() => setClaim('')}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>
                {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</p>}
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Analyzing claim: “{claim.trim() || 'Your claim'}”
                </div>
                <p className="text-sm text-slate-600">Waiting for the backend to retrieve sources and complete its analysis.</p>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="Investigation in progress">
                  <div className="h-full w-1/3 animate-pulse rounded-full bg-blue-600" />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.03)]">
              <SearchCheck className="mb-3 h-8 w-8 text-blue-700" />
              <h3 className="text-xl font-semibold text-slate-900">Source review</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">We compare independent reporting and public records before drawing conclusions.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.03)]">
              <FileSearch className="mb-3 h-8 w-8 text-blue-700" />
              <h3 className="text-xl font-semibold text-slate-900">Evidence extraction</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">The system separates supporting, contradicting, and unclear evidence for review.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.03)]">
              <CheckCheck className="mb-3 h-8 w-8 text-blue-700" />
              <h3 className="text-xl font-semibold text-slate-900">Neutral synthesis</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">TruthLens keeps uncertainty visible and avoids fabricated certainty.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

