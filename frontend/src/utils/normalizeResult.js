const VALID_RISK_LEVELS = new Set(['low', 'medium', 'high'])
const UNKNOWN_RISK = 'unknown'

function toSafeText(value, fallback = 'Unavailable') {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()
  return trimmed || fallback
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

function normalizeConfidence(value, fallback = 0) {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  const number = Number(value)
  if (!Number.isFinite(number)) {
    return fallback
  }

  if (number > 1 && number <= 100) {
    return Number((number / 100).toFixed(2))
  }

  if (number > 1) {
    return 1
  }

  if (number < 0) {
    return 0
  }

  return Number(Math.min(Math.max(number, 0), 1).toFixed(2))
}

function normalizeRisk(value, fallback = UNKNOWN_RISK) {
  const normalized = String(value ?? fallback).trim().toLowerCase()
  return VALID_RISK_LEVELS.has(normalized) ? normalized : fallback
}

function normalizeRelationship(value, fallback = 'unclear') {
  const normalized = String(value ?? fallback).trim().toLowerCase()
  if (['supporting', 'contradicting', 'unclear'].includes(normalized)) {
    return normalized
  }
  return fallback
}

function dedupeEvidenceList(entries, category) {
  const seen = new Set()
  return (Array.isArray(entries) ? entries : []).reduce((accumulator, entry) => {
    const evidence = entry && typeof entry === 'object' ? entry : null
    if (!evidence) return accumulator

    const statement = toSafeText(evidence.statement ?? evidence.text ?? 'Evidence statement unavailable.', 'Evidence statement unavailable.')
    const sourceId = evidence.sourceId ?? evidence.source?.id ?? 'missing-source'
    const key = `${category}|${String(sourceId).trim() || 'missing-source'}|${statement.toLowerCase()}`

    if (seen.has(key)) {
      return accumulator
    }

    seen.add(key)
    accumulator.push({
      id: evidence.id || evidence.sourceId || `${category}-${accumulator.length + 1}`,
      statement,
      relationship: normalizeRelationship(evidence.relationship ?? category, category),
      reason: toSafeText(evidence.reason ?? 'No explanation was supplied.', 'No explanation was supplied.'),
      sourceId: evidence.sourceId ?? evidence.source?.id ?? null,
      sourceTitle: toSafeText(evidence.sourceTitle ?? evidence.source?.title ?? 'Source information unavailable', 'Source information unavailable'),
      sourceUrl: toSafeUrl(evidence.sourceUrl ?? evidence.source?.url),
      confidence: normalizeConfidence(evidence.confidence, 0),
      subClaim: toSafeText(evidence.subClaim ?? evidence.subclaim ?? 'Not specified', 'Not specified'),
      publishedAt: evidence.publishedAt ?? evidence.source?.publishedAt ?? null,
    })

    return accumulator
  }, [])
}

function normalizeEvidence(rawEvidence) {
  const base = {
    supporting: [],
    contradicting: [],
    unclear: [],
  }

  if (!rawEvidence || typeof rawEvidence !== 'object') {
    return base
  }

  const categories = ['supporting', 'contradicting', 'unclear']

  categories.forEach((category) => {
    const items = Array.isArray(rawEvidence[category]) ? rawEvidence[category] : []
    base[category] = dedupeEvidenceList(items, category)
  })

  return base
}

function normalizeSources(rawSources) {
  if (!Array.isArray(rawSources)) return []

  return rawSources.reduce((accumulator, source) => {
    if (!source || typeof source !== 'object') return accumulator

    const normalized = {
      sourceId: source.sourceId || source.id || `source-${accumulator.length + 1}`,
      type: toSafeText(source.type ?? 'source', 'source'),
      title: toSafeText(source.title ?? source.sourceTitle ?? 'Source title unavailable', 'Source title unavailable'),
      url: toSafeUrl(source.url ?? source.sourceUrl),
      publishedAt: source.publishedAt ?? source.date ?? null,
      publisher: toSafeText(source.publisher ?? source.sourcePublisher ?? 'Publisher unavailable', 'Publisher unavailable'),
      content: toSafeText(source.content ?? source.excerpt ?? 'No source excerpt available.', 'No source excerpt available.'),
    }

    accumulator.push(normalized)
    return accumulator
  }, [])
}

function normalizeSuggestedVerification(value) {
  if (!Array.isArray(value)) return []
  return value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
}

function normalizeClaim(value) {
  if (!value || typeof value !== 'object') {
    return {
      original: '',
      normalized: '',
      subClaims: [],
    }
  }

  const subClaims = Array.isArray(value.subClaims) ? value.subClaims.filter((item) => typeof item === 'string' && item.trim()) : []

  return {
    original: toSafeText(value.original ?? value.text ?? value.claim ?? '', 'Claim unavailable'),
    normalized: toSafeText(value.normalized ?? value.claim ?? value.original ?? '', 'Claim unavailable'),
    subClaims: subClaims.map((item) => item.trim()),
  }
}

export function normalizeResult(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      checkId: '',
      claim: {
        original: 'Claim unavailable',
        normalized: 'Claim unavailable',
        subClaims: [],
      },
      assessment: {
        riskLevel: UNKNOWN_RISK,
        confidence: 0,
        summary: 'An evidence summary could not be generated from the available information.',
      },
      evidence: {
        supporting: [],
        contradicting: [],
        unclear: [],
      },
      sources: [],
      suggestedVerification: [],
    }
  }

  const assessment = raw.assessment ?? {}
  const confidence = normalizeConfidence(assessment.confidence ?? raw.confidence ?? 0, 0)

  return {
    checkId: raw.checkId || raw.id || '',
    claim: normalizeClaim(raw.claim ?? raw),
    assessment: {
      riskLevel: normalizeRisk(assessment.riskLevel ?? raw.riskLevel, UNKNOWN_RISK),
      confidence,
      summary: toSafeText(assessment.summary ?? raw.summary ?? 'An evidence summary could not be generated from the available information.', 'An evidence summary could not be generated from the available information.'),
    },
    evidence: normalizeEvidence(raw.evidence ?? {}),
    sources: normalizeSources(raw.sources ?? []),
    suggestedVerification: normalizeSuggestedVerification(raw.suggestedVerification ?? []),
  }
}
