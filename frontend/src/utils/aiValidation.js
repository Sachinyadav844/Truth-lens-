export function validateTriageOutput(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'AI response was empty.' }
  }

  const riskLevel = payload.riskLevel
  if (!['low', 'medium', 'high'].includes(riskLevel)) {
    return { valid: false, error: 'Invalid riskLevel.' }
  }

  const confidence = Number(payload.confidence)
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1) {
    return { valid: false, error: 'Confidence must be a number between 0 and 1.' }
  }

  if (typeof payload.summary !== 'string' || !payload.summary.trim()) {
    return { valid: false, error: 'Summary is required.' }
  }

  for (const key of ['supporting', 'contradicting', 'unclear']) {
    if (!Array.isArray(payload[key])) {
      return { valid: false, error: `Field ${key} must be an array.` }
    }
  }

  if (!Array.isArray(payload.suggestedVerification)) {
    return { valid: false, error: 'suggestedVerification must be an array.' }
  }

  return { valid: true }
}
