import { orchestrateSearch } from './searchOrchestrator.service.js'

export function normalizeClaim(text) {
  return typeof text === 'string' ? text.trim().replace(/\s+/g, ' ') : ''
}

export function decomposeClaim(text) {
  const normalized = normalizeClaim(text)
  if (!normalized) return []

  const separator = /\s+(?:and|but)\s+|\.\s*/gi
  const subClaims = []
  let start = 0
  let match

  while (subClaims.length < 2 && (match = separator.exec(normalized))) {
    const subClaim = normalized.slice(start, match.index).replace(/\.+$/, '').trim()
    if (subClaim) subClaims.push(subClaim)
    start = separator.lastIndex
  }

  const remainder = normalized.slice(start).replace(/\.+$/, '').trim()
  if (remainder) subClaims.push(remainder)

  return subClaims
}

export async function runClaimCheck(claim) {
  const sources = await orchestrateSearch(claim)
  return { claim, status: 'pending-analysis', sources, checkedAt: new Date().toISOString() }
}
