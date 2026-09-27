const VALID_RISK_LEVELS = new Set(['low', 'medium', 'high'])

export function normalizeConfidence(value, fallback = 0) {
  if (typeof value !== 'number' && typeof value !== 'string') return fallback

  const parsed = Number(String(value).replace(/%/g, '').trim())
  if (Number.isNaN(parsed)) return fallback

  if (parsed > 1) {
    return Number(Math.min(Math.max(parsed / 100, 0), 1).toFixed(2))
  }

  return Number(Math.min(Math.max(parsed, 0), 1).toFixed(2))
}

export function normalizeRisk(value, fallback = 'medium') {
  const normalized = String(value ?? fallback).trim().toLowerCase()
  return VALID_RISK_LEVELS.has(normalized) ? normalized : fallback
}

function toSafeUrl(url) {
  if (typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  try {
    const parsed = new URL(trimmed)
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : ''
  } catch (error) {
    return ''
  }
}

export function mapEvidenceEntry(entry, category = 'supporting') {
  if (!entry || typeof entry !== 'object') {
    return {
      id: `evidence-${category}-${Date.now()}`,
      statement: 'Evidence item unavailable.',
      relationship: category,
      reason: 'No additional context was provided.',
      sourceId: null,
      sourceTitle: 'Source unavailable',
      sourceUrl: '',
      confidence: 0,
      subClaim: 'Not specified',
    }
  }

  return {
    id: entry.id || entry.sourceId || `${category}-${Date.now()}`,
    statement: entry.statement || entry.text || 'Evidence statement unavailable.',
    relationship: String(entry.relationship || category).toLowerCase(),
    reason: entry.reason || 'No explanation was supplied.',
    sourceId: entry.sourceId || null,
    sourceTitle: entry.sourceTitle || entry.source?.title || 'Source unavailable',
    sourceUrl: toSafeUrl(entry.sourceUrl || entry.source?.url),
    confidence: normalizeConfidence(entry.confidence, 0),
    subClaim: entry.subClaim || entry.subclaim || 'Not specified',
    publishedAt: entry.publishedAt || entry.source?.publishedAt || null,
  }
}

export function mapCheckResponse(data) {
  if (!data || typeof data !== 'object') {
    return {
      checkId: '',
      claim: { original: '', normalized: '', subClaims: [] },
      assessment: { riskLevel: 'medium', confidence: 0, summary: 'No assessment available.' },
      evidence: { supporting: [], contradicting: [], unclear: [] },
      sources: [],
      suggestedVerification: [],
    }
  }

  const evidence = {
    supporting: Array.isArray(data.evidence?.supporting) ? data.evidence.supporting.map((entry) => mapEvidenceEntry(entry, 'supporting')) : [],
    contradicting: Array.isArray(data.evidence?.contradicting) ? data.evidence.contradicting.map((entry) => mapEvidenceEntry(entry, 'contradicting')) : [],
    unclear: Array.isArray(data.evidence?.unclear) ? data.evidence.unclear.map((entry) => mapEvidenceEntry(entry, 'unclear')) : [],
  }

  const sources = Array.isArray(data.sources) ? data.sources.map((source) => ({
    sourceId: source?.sourceId || source?.id || `source-${Math.random().toString(16).slice(2, 8)}`,
    type: source?.type || 'source',
    title: source?.title || source?.sourceTitle || 'Source title unavailable',
    url: toSafeUrl(source?.url || source?.sourceUrl),
    publishedAt: source?.publishedAt || null,
    publisher: source?.publisher || source?.sourcePublisher || 'Publisher unavailable',
    content: source?.content || source?.excerpt || 'No source excerpt available.',
  })) : []

  return {
    checkId: data.checkId || data.id || '',
    claim: {
      original: data.claim?.original || data.claim || '',
      normalized: data.claim?.normalized || data.claim || '',
      subClaims: Array.isArray(data.claim?.subClaims) ? data.claim.subClaims : [],
    },
    assessment: {
      riskLevel: normalizeRisk(data.assessment?.riskLevel || data.riskLevel, 'medium'),
      confidence: normalizeConfidence(data.assessment?.confidence ?? data.confidence, 0),
      summary: data.assessment?.summary || 'No summary available.',
    },
    evidence,
    sources,
    suggestedVerification: Array.isArray(data.suggestedVerification) ? data.suggestedVerification.filter(Boolean) : [],
  }
}

export function mapHistoryItem(item) {
  if (!item || typeof item !== 'object') {
    return {
      id: '',
      claim: 'Unknown claim',
      risk: 'medium',
      confidence: 0,
      evidenceCount: 0,
      date: null,
    }
  }

  const id = item.checkId || item.id || ''
  const evidenceCount = typeof item.evidenceCount === 'number' ? item.evidenceCount : 0
  const claimText = item.claim || item.originalClaim || 'Unknown claim'

  return {
    id,
    claim: claimText,
    risk: normalizeRisk(item.riskLevel || item.risk || 'medium', 'medium'),
    confidence: normalizeConfidence(item.confidence ?? 0, 0),
    evidenceCount,
    date: item.createdAt || item.date || item.updatedAt || null,
  }
}

export function mapHistoryResponse(data) {
  const items = Array.isArray(data?.history) ? data.history : Array.isArray(data) ? data : []
  return items.map(mapHistoryItem)
}
