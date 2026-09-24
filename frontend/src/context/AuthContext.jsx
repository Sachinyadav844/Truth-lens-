import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'truthlens-auth'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        setUser(parsed.user ?? null)
        setToken(parsed.token ?? null)
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }

    setLoading(false)
  }, [])

  const login = (nextUser, nextToken = 'mock-token') => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }))
  }

  const signup = (nextUser, nextToken = 'mock-token') => {
    setUser(nextUser)
    setToken(nextToken)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
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
  return useContext(AuthContext)
}
