import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import DashboardPage from './pages/Dashboard'
import CheckPage from './pages/Check'
import ResultPage from './pages/Result'
import HistoryPage from './pages/History'
import NotFoundPage from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

function AppRoutes() {
  const { loading, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const titles = {
      '/': 'TruthLens | Evidence Before Conclusions',
      '/login': 'Sign In | TruthLens',
      '/signup': 'Create Account | TruthLens',
      '/dashboard': 'Dashboard | TruthLens',
      '/check': 'Check a Claim | TruthLens',
      '/history': 'Investigation History | TruthLens',
    }

    const match = location.pathname.match(/^\/result\/(.+)$/)
    document.title = match ? 'Investigation Result | TruthLens' : titles[location.pathname] || 'TruthLens'
  }, [location.pathname])

  useEffect(() => {
    const handleAuthRedirect = () => {
      if (!isAuthenticated) {
        navigate('/login', { replace: true })
      }
    }

    window.addEventListener('auth:logged-out', handleAuthRedirect)
    window.addEventListener('auth:session-expired', handleAuthRedirect)

    return () => {
      window.removeEventListener('auth:logged-out', handleAuthRedirect)
      window.removeEventListener('auth:session-expired', handleAuthRedirect)
    }
  }, [isAuthenticated, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-blue-100 bg-white px-6 py-4 text-sm font-medium text-slate-500 shadow-sm">
          Loading TruthLens...
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/check"
        element={
          <ProtectedRoute>
            <CheckPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result/:id"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
