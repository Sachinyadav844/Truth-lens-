const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export async function checkClaim(claim) {
  const response = await fetch(`${API_URL}/checks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ claim }),
  })

  if (!response.ok) throw new Error('The claim check could not be completed.')
  return response.json()
}
