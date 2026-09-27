import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authLogin, authSignup } from '../services/api'
import { clearSession, getSession, setSession } from '../utils/authStorage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSession()
    setUser(session.user)
    setToken(session.token)
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null)
      setToken(null)
      clearSession()
    }

    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired)
  }, [])

  const persistSession = (nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    setSession({ user: nextUser, token: nextToken })
  }

  const login = async (credentials) => {
    const response = await authLogin(credentials)
    persistSession(response.user, response.token)
    return response
  }

  const signup = async (credentials) => {
    const response = await authSignup(credentials)
    persistSession(response.user, response.token)
    return response
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    clearSession()
    window.dispatchEvent(new CustomEvent('auth:logged-out'))
  }

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      signup,
      logout,
      loading,
      isAuthenticated: Boolean(user && token),
    }),
    [user, token, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return context
}
