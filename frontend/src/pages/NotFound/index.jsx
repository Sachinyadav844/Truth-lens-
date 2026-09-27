import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="page-shell flex min-h-[60vh] items-center justify-center py-16">
        <div className="truth-card max-w-lg p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">404</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.07em] text-slate-900">Page not found</h1>
          <p className="mt-4 text-slate-600">
            The page you are looking for does not exist or has moved.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="btn-primary inline-flex">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to TruthLens
            </Link>
            <Link to="/dashboard" className="btn-secondary inline-flex">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
