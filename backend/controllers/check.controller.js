import { runClaimCheck } from '../services/claimControl.service.js'

export async function createCheck(request, response, next) {
  try {
    const { claim } = request.body
    if (!claim || typeof claim !== 'string') return response.status(400).json({ error: 'claim is required' })
    const result = await runClaimCheck(claim)
    return response.status(201).json(result)
  } catch (error) {
    return next(error)
  }
}
