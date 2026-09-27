import { checks, buildCheckResult } from '../utils/store.js'

export async function createCheck(request, response) {
  try {
    const rawContent = request.body?.content ?? request.body?.claim
    const content = typeof rawContent === 'string' ? rawContent.trim() : ''

    if (!content) {
      return response.status(400).json({ message: 'A claim is required.' })
    }

    const result = buildCheckResult(content)
    checks.set(result.checkId, result)
    return response.status(201).json(result)
  } catch (error) {
    return response.status(500).json({ message: 'The analysis service is temporarily unavailable.' })
  }
}

export async function getCheckById(request, response) {
  try {
    const result = checks.get(request.params.id)
    if (!result) {
      return response.status(404).json({ message: 'No investigation was found.' })
    }

    return response.json(result)
  } catch (error) {
    return response.status(500).json({ message: 'Unable to load this investigation.' })
  }
}

export async function getHistory(request, response) {
  try {
    const history = Array.from(checks.values()).map((check) => ({
      checkId: check.checkId,
      claim: check.claim.original,
      riskLevel: check.assessment.riskLevel,
      confidence: check.assessment.confidence,
      evidenceCount: Object.values(check.evidence || {}).reduce((total, items) => total + (Array.isArray(items) ? items.length : 0), 0),
      createdAt: new Date().toISOString(),
    }))

    return response.json({ history })
  } catch (error) {
    return response.status(500).json({ message: 'Unable to load history.' })
  }
}
