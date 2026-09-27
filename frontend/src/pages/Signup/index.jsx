import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'

const passwordChecks = ['8+ characters', 'Uppercase', 'Number']

export default function SignupPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordStrength = (() => {
    if (!form.password) return 0
    let score = 0
    if (form.password.length >= 8) score += 1
    if (/[A-Z]/.test(form.password)) score += 1
    if (/\d/.test(form.password)) score += 1
    return score
  })()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Please complete all fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please use a valid email address.')
      return
    }

    if (form.password.length < 8) {
      setError('Use a password with at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('The password confirmation does not match.')
      return
    }

    setLoading(true)
    try {
      await signup({ name: form.name, email: form.email, password: form.password })
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="page-shell py-16">
        <div className="mx-auto max-w-md">
          <div className="truth-card p-8">
            <div className="mb-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Create account</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.07em] text-slate-900">Get started</h1>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Name</span>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className="form-field pl-10" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" autoComplete="name" aria-invalid={Boolean(error)} />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className="form-field pl-10" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" aria-invalid={Boolean(error)} />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="form-field pl-10 pr-10"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    aria-invalid={Boolean(error)}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {[...Array(3)].map((_, index) => (
                    <span key={index} className={`h-1.5 flex-1 rounded-full ${index < passwordStrength ? 'bg-blue-600' : 'bg-slate-200'}`} />
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                  {passwordChecks.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input className="form-field pl-10" type={showPassword ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password" autoComplete="new-password" aria-invalid={Boolean(error)} />
                </div>
              </label>

              {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account? <Link to="/login" state={location.state} className="font-semibold text-blue-700 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

