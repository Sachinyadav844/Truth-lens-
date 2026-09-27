import axios from 'axios'
import { clearSession, getSession } from '../utils/authStorage'

function getBaseApiUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000'
  return String(raw).replace(/\/$/, '')
}

function normalizeApiError(error, fallback) {
  if (!error) return fallback

  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Please check your internet connection and try again.'
  }

  if (error.response?.status === 400) {
    return error.response?.data?.message || 'Please check your details and try again.'
  }

  if (error.response?.status === 401) {
    return 'Your session has expired. Please sign in again.'
  }

  if (error.response?.status === 404) {
    return 'The requested record could not be found.'
  }

  if (error.response?.status === 429) {
    return 'Too many requests. Please wait a moment and try again.'
  }

  if (error.response?.status >= 500) {
    return 'The server is temporarily unavailable. Please try again.'
  }

  const backendMessage = error.response?.data?.message || error.response?.data?.error || error.message
  return backendMessage || fallback
}

export function createApiClient() {
  const client = axios.create({
    baseURL: `${getBaseApiUrl()}/api`,
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use((config) => {
    const session = getSession()
    const token = session?.token

    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.signal) {
      config.signal = config.signal
    }

    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        clearSession()
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.dispatchEvent(new CustomEvent('auth:session-expired'))
        }
      }

      return Promise.reject(error)
    },
  )

  return client
}

export const api = createApiClient()

export async function authSignup(payload) {
  try {
    const { data } = await api.post('/auth/signup', payload)
    return data
  } catch (error) {
    throw new Error(normalizeApiError(error, 'Unable to create your account.'))
  }
}

export async function authLogin(payload) {
  try {
    const { data } = await api.post('/auth/login', payload)
    return data
  } catch (error) {
    throw new Error(normalizeApiError(error, 'Invalid email or password.'))
  }
}

export async function submitClaim(content) {
  try {
    const response = await api.post('/check', { content })
    return response.data
  } catch (error) {
    throw new Error(normalizeApiError(error, 'Unable to analyze this claim.'))
  }
}

export async function getCheck(id) {
  try {
    const response = await api.get(`/check/${id}`)
    return response.data
  } catch (error) {
    throw new Error(normalizeApiError(error, 'Unable to load this investigation.'))
  }
}

export async function getHistory() {
  try {
    const response = await api.get('/check/history')
    return response.data.history || []
  } catch (error) {
    throw new Error(normalizeApiError(error, 'Unable to load your history.'))
  }
}

export async function healthCheck() {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    throw new Error(normalizeApiError(error, 'TruthLens could not reach the analysis service.'))
  }
}
