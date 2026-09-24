export function extractEvidence(sources) { return sources.flatMap((source) => source.items || []) }
