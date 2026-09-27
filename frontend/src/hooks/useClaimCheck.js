import { useState } from 'react'
import { submitClaim } from '../services/api'
import { mapCheckResponse } from '../utils/mappers'

export function useClaimCheck() {
  const [state, setState] = useState({ loading: false, error: null, result: null })

  async function run(claim) {
    const trimmed = String(claim || '').trim()
    setState({ loading: true, error: null, result: null })

    try {
      const raw = await submitClaim(trimmed)
      const mapped = mapCheckResponse(raw)
      setState({ loading: false, error: null, result: mapped })
      return mapped
    } catch (error) {
      setState({ loading: false, error: error.message, result: null })
      return null
    }
  }

  return { ...state, run }
}
