const STORAGE_KEY = 'truthlens-auth'

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, token: null }
    const parsed = JSON.parse(raw)
    return {
      user: parsed?.user ?? null,
      token: parsed?.token ?? null,
    }
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY)
    return { user: null, token: null }
  }
}

export function setSession({ user, token }) {
  if (!user || !token) {
    clearSession()
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}
