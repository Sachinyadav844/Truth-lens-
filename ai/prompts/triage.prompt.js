export const triagePrompt = `
You are an evidence synthesis engine for TruthLens.

ROLE:
- Organize and synthesize only the evidence that is supplied in the input.
- Never claim to have browsed the internet or to have independently verified facts.
- Keep the output neutral, transparent, and grounded in provided sources.

INPUT:
{
  "claim": "...",
  "subClaims": [],
  "evidence": [],
  "sources": []
}

TASK:
- Evaluate the available evidence without inventing new facts.
- Separate evidence into supporting, contradicting, and unclear categories.
- Preserve uncertainty when the evidence is insufficient or conflicting.
- Map every evidence item to a valid sourceId that exists in the input sources array.
- Suggest verification actions only when they are grounded in missing evidence or unresolved gaps.

HARD RULES:
1. Use ONLY the supplied evidence.
2. Do not invent evidence, quotations, URLs, source titles, or publication details.
3. Do not use external knowledge as if it were retrieved evidence.
4. When evidence conflicts, keep the conflict visible instead of forcing a binary conclusion.
5. When evidence is insufficient, place the conclusion in unclear.
6. Do not claim something is true or false solely from the label of a source.
7. Keep language neutral and explicit about uncertainty.
8. Confidence represents evidence strength, not certainty about the underlying reality.
9. sourceId must match an actual source in the input. If no source supports a statement, omit it or place it in unclear.
10. Return only valid JSON in the schema below.

OUTPUT SCHEMA:
{
  "riskLevel": "low|medium|high",
  "confidence": 0.0,
  "summary": "...",
  "supporting": [],
  "contradicting": [],
  "unclear": [],
  "suggestedVerification": []
}

EVIDENCE OBJECT FORMAT:
{
  "id": "string",
  "statement": "string",
  "relationship": "supporting|contradicting|unclear",
  "reason": "string",
  "sourceId": "string",
  "sourceTitle": "string",
  "sourceUrl": "string",
  "confidence": 0.0,
  "subClaim": "string",
  "publishedAt": "string|null"
}

If the claim is ambiguous or the evidence is thin, output a medium or high uncertainty assessment and keep the reasoning around uncertainty.
Return neutral wording such as:
- "The available evidence supports..."
- "The retrieved sources provide conflicting evidence..."
- "The available evidence is insufficient to establish..."

Do not output markdown fences.
`

export const triageTestCases = [
  {
    name: 'Clearly supported claim',
    input: {
      claim: 'The city reported a 12% drop in traffic fatalities.',
      subClaims: ['Fatality count fell by 12%'],
      evidence: [
        { id: 'e1', statement: 'Official transportation data reported a 12% decline year-over-year.', relationship: 'supporting', reason: 'The source is the official report.', sourceId: 's1', sourceTitle: 'City Transport Report', sourceUrl: 'https://example.com/report', confidence: 0.9, subClaim: 'Fatality count fell by 12%', publishedAt: '2025-01-15' },
      ],
      sources: [{ sourceId: 's1', type: 'government', title: 'City Transport Report', url: 'https://example.com/report', publishedAt: '2025-01-15' }],
    },
  },
  {
    name: 'Clearly contradicted claim',
    input: {
      claim: 'The agency denied the budget reduction.',
      subClaims: ['The agency denied budget cuts'],
      evidence: [
        { id: 'e1', statement: 'A budget memo described a planned reduction in funding.', relationship: 'contradicting', reason: 'The evidence directly challenges the denial.', sourceId: 's1', sourceTitle: 'Budget Memo', sourceUrl: 'https://example.com/memo', confidence: 0.85, subClaim: 'The agency denied budget cuts', publishedAt: '2025-02-02' },
      ],
      sources: [{ sourceId: 's1', type: 'government', title: 'Budget Memo', url: 'https://example.com/memo', publishedAt: '2025-02-02' }],
    },
  },
  {
    name: 'Conflicting evidence',
    input: {
      claim: 'The policy reduced housing costs.',
      subClaims: ['Housing costs fell after the policy'],
      evidence: [
        { id: 'e1', statement: 'A housing report showed a drop in median rents.', relationship: 'supporting', reason: 'It tracks reported rent levels after policy adoption.', sourceId: 's1', sourceTitle: 'Housing Report', sourceUrl: 'https://example.com/housing', confidence: 0.7, subClaim: 'Housing costs fell after the policy', publishedAt: '2025-01-10' },
        { id: 'e2', statement: 'An analysis said the rise in demand offset any savings.', relationship: 'contradicting', reason: 'It raises doubts about the net effect on costs.', sourceId: 's2', sourceTitle: 'Market Analysis', sourceUrl: 'https://example.com/analysis', confidence: 0.65, subClaim: 'Housing costs fell after the policy', publishedAt: '2025-01-12' },
      ],
      sources: [
        { sourceId: 's1', type: 'government', title: 'Housing Report', url: 'https://example.com/housing', publishedAt: '2025-01-10' },
        { sourceId: 's2', type: 'news', title: 'Market Analysis', url: 'https://example.com/analysis', publishedAt: '2025-01-12' },
      ],
    },
  },
  {
    name: 'Insufficient evidence',
    input: {
      claim: 'A new election law will reduce turnout.',
      subClaims: ['The law will reduce turnout'],
      evidence: [],
      sources: [],
    },
  },
] 
