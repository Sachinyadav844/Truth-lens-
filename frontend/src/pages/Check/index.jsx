import { useEffect, useState } from 'react'
import { CheckCheck, FileSearch, SearchCheck, Sparkles } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ClaimInput from '../../components/ClaimInput'
import { exampleClaims } from '../../utils/mockData'
import { useClaimCheck } from '../../hooks/useClaimCheck'

const steps = [
  'Understanding claim',
  'Breaking into subclaims',
  'Searching sources',
  'Extracting evidence',
  'Comparing evidence',
  'Preparing neutral summary',
]

export default function CheckPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [claim, setClaim] = useState(location.state?.claim || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [progressIndex, setProgressIndex] = useState(0)
  const { run } = useClaimCheck()

  useEffect(() => {
    if (!loading) return undefined

    const interval = setInterval(() => {
      setProgressIndex((current) => (current >= steps.length - 1 ? current : current + 1))
    }, 500)

    return () => {
      clearInterval(interval)
    }
  }, [loading])

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
    setProgressIndex(0)
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
                  <Sparkles className="h-4 w-4" />
                  Analyzing claim: “{claim.trim() || 'Your claim'}”
                </div>

                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${index <= progressIndex ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center justify-between gap-2 text-sm font-medium text-slate-700">
                          <span>{step}</span>
                          <span className={index <= progressIndex ? 'text-blue-700' : 'text-slate-400'}>
                            {index <= progressIndex ? 'Complete' : 'Queued'}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500 ${index <= progressIndex ? 'w-full' : 'w-0'}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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

