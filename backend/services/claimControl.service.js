import { orchestrateSearch } from './searchOrchestrator.service.js'

export async function runClaimCheck(claim) {
  const sources = await orchestrateSearch(claim)
  return { claim, status: 'pending-analysis', sources, checkedAt: new Date().toISOString() }
}
