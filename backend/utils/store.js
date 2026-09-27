import crypto from 'crypto'

export const users = new Map()
export const checks = new Map()
export const sessions = new Map()

export function createToken() {
  return `truthlens_${crypto.randomBytes(18).toString('hex')}`
}

export function normalizeClaim(content) {
  const trimmed = String(content || '').trim()
  if (!trimmed) return ''

  return trimmed
    .replace(/\s+/g, ' ')
    .replace(/\s*([.,!?;:])/g, '$1')
    .trim()
}

export function buildCheckResult(content) {
  const normalized = normalizeClaim(content)
  const subClaims = []

  const text = normalized.toLowerCase()
  const claimWords = normalized.split(/\s+/)

  if (claimWords.length >= 3) {
    const first = claimWords.slice(0, Math.min(4, claimWords.length)).join(' ')
    const second = claimWords.slice(Math.max(0, claimWords.length - 4)).join(' ')
    if (first) subClaims.push(first)
    if (second && second !== first) subClaims.push(second)
  }

  const hasEvidence = /\d|%|year|month|report|study|data|official|survey|agency|city|policy|government|news|study/i.test(normalized)
  const riskLevel = hasEvidence ? 'medium' : 'high'
  const confidence = hasEvidence ? 0.72 : 0.41

  const result = {
    checkId: `check_${crypto.randomUUID()}`,
    claim: {
      original: normalized,
      normalized,
      subClaims,
    },
    assessment: {
      riskLevel,
      confidence,
      summary: hasEvidence
        ? 'The available evidence appears to include some supporting context, but the claim still needs source verification before drawing a firm conclusion.'
        : 'The claim is under-specified and the available evidence is too limited to reach a confident conclusion.',
    },
    evidence: {
      supporting: [
        {
          id: `ev_${crypto.randomUUID()}`,
          statement: hasEvidence ? 'The claim includes concrete figures or qualifying context that can be checked against public reporting.' : 'The claim is too vague for a strong evidence-based assessment.',
          relationship: 'supporting',
          reason: 'The wording references verifiable details that could be corroborated by retrieved sources.',
          sourceId: 'source-1',
          sourceTitle: 'Evidence record',
          sourceUrl: 'https://example.com/record',
          confidence: 0.7,
          subClaim: subClaims[0] || 'Core claim',
          publishedAt: new Date().toISOString(),
        },
      ],
      contradicting: [],
      unclear: [
        {
          id: `ev_${crypto.randomUUID()}`,
          statement: 'Additional sourcing is needed to verify whether the statement is complete and current.',
          relationship: 'unclear',
          reason: 'The evidence is insufficient to fully resolve the claim without stronger source corroboration.',
          sourceId: 'source-2',
          sourceTitle: 'Verification gap',
          sourceUrl: 'https://example.com/verification-gap',
          confidence: 0.45,
          subClaim: subClaims[1] || 'Verification status',
          publishedAt: new Date().toISOString(),
        },
      ],
    },
    sources: [
      {
        sourceId: 'source-1',
        title: 'Evidence record',
        url: 'https://example.com/record',
        type: 'news',
        publisher: 'TruthLens',
        publishedAt: new Date().toISOString(),
      },
      {
        sourceId: 'source-2',
        title: 'Verification gap',
        url: 'https://example.com/verification-gap',
        type: 'wikipedia',
        publisher: 'TruthLens',
        publishedAt: new Date().toISOString(),
      },
    ],
    suggestedVerification: [
      'Cross-check the claim against a primary source or official report.',
      'Look for corroborating reporting from a second independent outlet.',
      'Confirm whether the claim is time-sensitive, local, or context-dependent.',
    ],
  }

  return result
}
