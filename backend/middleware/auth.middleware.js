import { sessions, users } from '../utils/store.js'

export function requireAuth(request, response, next) {
  const authHeader = request.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return response.status(401).json({ error: 'Authentication required.' })
  }

  const email = sessions.get(token)
  if (!email) {
    return response.status(401).json({ error: 'Authentication required.' })
  }

  const user = users.get(email)
  if (!user) {
    return response.status(401).json({ error: 'Authentication required.' })
  }

  request.user = user
  return next()
}
