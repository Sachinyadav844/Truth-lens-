import { useState } from 'react'
import { ArrowRight, BadgeCheck, BookOpenText, ChartColumn, CheckCheck, CircleDashed, FileSearch, Search, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ClaimInput from '../../components/ClaimInput'
import FeatureCard from '../../components/FeatureCard'
import { exampleClaims, featureCards } from '../../utils/mockData'
import { heroImageSources } from '../../utils/imageSources'

const iconMap = {
  search: Search,
  scale: TrendingUp,
  check: BadgeCheck,
  folder: BookOpenText,
  users: Users,
}

const processSteps = [
  { title: 'Understand the claim', description: 'Break a statement into concrete, checkable assertions.', icon: Search },
  { title: 'Search independent sources', description: 'Pull from public records, reports, and trusted coverage.', icon: FileSearch },
  { title: 'Compare evidence', description: 'Display supporting, contradicting, and unclear findings side by side.', icon: ChartColumn },
  { title: 'Generate neutral synthesis', description: 'Summarize the evidence without overstating certainty.', icon: CheckCheck },
]

const trustPoints = [
  'Evidence is shown alongside the conclusion.',
  'Sources are linked and reviewable.',
  'Conflicting evidence remains visible.',
  'Uncertainty is kept transparent instead of hidden.',
]

function HeroImageCard({ src, alt, className = '', badge }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`group relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-[0_24px_60px_rgba(37,99,235,0.12)] ${className}`}>
      {!failed ? (
        <img src={src} alt={alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" onError={() => setFailed(true)} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 via-sky-50 to-white text-sm font-semibold text-blue-700">
          TruthLens
        </div>
      )}
      {badge ? <div className="absolute bottom-4 left-4 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">{badge}</div> : null}
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [claim, setClaim] = useState('')

  const handleSubmit = () => {
    if (!claim.trim()) return
    navigate('/check', { state: { claim: claim.trim() } })
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="overflow-hidden">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),_transparent_35%),linear-gradient(180deg,#f5f9ff_0%,#ffffff_55%)]">
          <div className="page-shell relative py-10 sm:py-14 lg:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
              <div className="max-w-xl">
                <p className="mb-5 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-blue-700">
                  Facts • Evidence • Clarity
                </p>
                <h1 className="text-4xl font-extrabold leading-[0.96] tracking-[-0.08em] text-slate-900 sm:text-5xl lg:text-[4.35rem]">
                  Check claims with <span className="text-blue-600">evidence</span>, not assumptions.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                  TruthLens helps journalists, researchers, and citizens verify public claims, compare independent sources, and assess uncertainty before drawing a well-supported conclusion.
                </p>

                <div className="mt-8 rounded-[28px] border border-slate-200 bg-white/80 p-3 shadow-[0_24px_70px_rgba(37,99,235,0.08)] backdrop-blur-sm">
                  <ClaimInput
                    value={claim}
                    onChange={(event) => setClaim(event.target.value)}
                    onSubmit={handleSubmit}
                    buttonLabel="Analyze Claim"
                    placeholder="Paste a claim, headline, or statistic to investigate..."
                    examples={exampleClaims}
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {exampleClaims.map((example) => (
                    <button
                      key={example}
                      type="button"
                      onClick={() => setClaim(example)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[560px]">
                <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                  <HeroImageCard src={heroImageSources.newsroom} alt="People reading a newspaper and reviewing information" className="h-[260px] sm:h-[340px]" badge="Source search" />
                  <div className="space-y-4">
                    <HeroImageCard src={heroImageSources.research} alt="Research documents and analysis materials" className="h-[170px] sm:h-[180px]" badge="Evidence" />
                    <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_20px_40px_rgba(15,23,42,0.04)]">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Evidence categories</p>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">Supporting</span>
                        <span className="rounded-full bg-rose-50 px-3 py-1.5 text-rose-700">Contradicting</span>
                        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">Unclear</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-3 top-6 hidden w-52 rounded-[24px] border border-slate-200 bg-white/80 p-3 shadow-[0_18px_42px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:block">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Search className="h-4 w-4 text-blue-600" />
                    Find claims
                  </div>
                  <div className="h-2.5 w-14 rounded-full bg-slate-200" />
                  <div className="mt-2 h-2.5 w-10 rounded-full bg-slate-100" />
                </div>
                <div className="absolute -right-2 bottom-8 hidden w-52 rounded-[24px] border border-slate-200 bg-white/80 p-3 shadow-[0_18px_42px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:block">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <CircleDashed className="h-4 w-4 text-blue-600" />
                    Compare sources
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 rounded-full bg-emerald-100"><div className="h-full w-[70%] rounded-full bg-emerald-500" /></div>
                    <div className="h-2 rounded-full bg-amber-100"><div className="h-full w-[42%] rounded-full bg-amber-500" /></div>
                    <div className="h-2 rounded-full bg-rose-100"><div className="h-full w-[28%] rounded-full bg-rose-500" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell py-12 sm:py-16 lg:py-20">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {featureCards.map(({ title, description, icon, accent }) => (
              <FeatureCard key={title} title={title} description={description} icon={iconMap[icon]} accent={accent} />
            ))}
          </div>
        </section>

        <section id="how-it-works" className="page-shell pb-12 sm:pb-16 lg:pb-20">
          <div className="mb-8 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-600">How it works</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.07em] text-slate-900 sm:text-4xl">Evidence-first investigation, step by step.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map(({ title, description, icon: Icon }, index) => (
              <div key={title} className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.02)] transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-blue-600">0{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.04em] text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="bg-slate-50 py-12 sm:py-16 lg:py-20">
          <div className="page-shell">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-600">Evidence categories</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.07em] text-slate-900 sm:text-4xl">Clear classifications, not hidden uncertainty.</h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                { label: 'Supporting', tone: 'emerald', description: 'Claims backed by multiple credible signals and corroboration.', icon: ShieldCheck },
                { label: 'Unclear', tone: 'amber', description: 'The evidence points in multiple directions or remains incomplete.', icon: CircleDashed },
                { label: 'Contradicting', tone: 'rose', description: 'Independent sources disagree or materially challenge the claim.', icon: Search },
              ].map(({ label, tone, description, icon: Icon }) => (
                <article key={label} className={`rounded-[28px] border p-6 shadow-[0_12px_28px_rgba(15,23,42,0.03)] ${tone === 'emerald' ? 'border-emerald-200 bg-emerald-50/70' : tone === 'amber' ? 'border-amber-200 bg-amber-50/80' : 'border-rose-200 bg-rose-50/80'}`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone === 'emerald' ? 'bg-emerald-100 text-emerald-700' : tone === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-2xl font-bold tracking-[-0.05em] text-slate-900">{label}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="page-shell pb-12 sm:pb-16 lg:pb-20">
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.04)] sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-600">Trust & transparency</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.07em] text-slate-900 sm:text-4xl">Evidence is shown. Uncertainty stays visible.</h2>
              </div>

              <div className="space-y-3">
                {trustPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="page-shell pb-16 sm:pb-20">
          <div className="overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 to-blue-600 p-6 text-white shadow-[0_24px_60px_rgba(37,99,235,0.22)] sm:p-8 lg:p-12">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">Investigate with evidence</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.07em] text-white sm:text-4xl">Investigate a claim with evidence.</h2>
              </div>
              <Link to="/check" className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50">
                Check a Claim <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

