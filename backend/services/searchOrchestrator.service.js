export async function orchestrateSearch(claim) {
  return [{ provider: 'pending', query: claim, items: [] }]
}
