export async function analyzeEvidence() { return { verdict: 'unavailable', confidence: 0 } }

// Structured adapter contract for the controller; replace this placeholder with the AI provider implementation.
export async function analyzeClaim(data) {
	const analysis = await analyzeEvidence(data)
	const evidence = analysis.evidence ?? analysis

	return {
		assessment: analysis.assessment ?? {
			riskLevel: analysis.riskLevel ?? analysis.verdict ?? 'unavailable',
			confidence: analysis.confidence ?? 0,
			summary: analysis.summary ?? 'AI analysis is not configured.'
		},
		evidence: {
			supporting: evidence.supporting ?? [],
			contradicting: evidence.contradicting ?? [],
			unclear: evidence.unclear ?? []
		},
		sources: analysis.sources ?? data.searchResults.flatMap((result) => result.items ?? [])
	}
}
