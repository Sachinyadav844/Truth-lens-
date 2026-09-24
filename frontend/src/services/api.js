import axios from 'axios'
import { mockHistory, mockResult, mockUser } from '../utils/mockData'

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
})

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback
}

export async function authSignup(payload) {
  if (useMocks) {
    await wait(300)
    return { user: { id: 'user-1', name: payload.name, email: payload.email }, token: 'mock-token' }
  }

  try {
    const { data } = await api.post('/auth/signup', payload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to create your account.'))
  }
}

export async function authLogin(payload) {
  if (useMocks) {
    await wait(300)
    return { user: { id: 'user-1', name: mockUser.name, email: payload.email }, token: 'mock-token' }
  }

  try {
    const { data } = await api.post('/auth/login', payload)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to sign in.'))
  }
}

export async function getCurrentUser() {
  if (useMocks) {
    await wait(250)
    return mockUser
  }

  const { data } = await api.get('/auth/me')
  return data.user || data
}

export async function checkClaim(claim) {
  if (useMocks) {
    await wait(1800)
    return {
      ...mockResult,
      claim: { ...mockResult.claim, original: claim, normalized: claim.trim() },
      checkId: `check-${Date.now()}`,
    }
  }

  try {
    const { data } = await api.post('/checks', { claim })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to analyze this claim.'))
  }
}

export async function getResult(id) {
  if (useMocks) {
    await wait(250)
    return { ...mockResult, checkId: id }
  }

  const { data } = await api.get(`/checks/${id}`)
  return data
}

export async function getHistory() {
  if (useMocks) {
    await wait(250)
    return mockHistory
  }

  const { data } = await api.get('/checks/history')
  return data.checks || data
}
