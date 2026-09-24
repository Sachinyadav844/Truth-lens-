import { useState } from 'react'
import { checkClaim } from '../services/api'

export function useClaimCheck() {
  const [state, setState] = useState({ loading: false, error: null, result: null })

  async function run(claim) {
    setState({ loading: true, error: null, result: null })
    try {
      const result = await checkClaim(claim)
      setState({ loading: false, error: null, result })
    } catch (error) {
      setState({ loading: false, error: error.message, result: null })
    }
  }

  return { ...state, run }
}
