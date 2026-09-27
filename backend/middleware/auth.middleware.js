<<<<<<< HEAD
import jwt from 'jsonwebtoken';

export function requireAuth(request, response, next) {
	const authorization = request.headers.authorization;
	const match = authorization?.match(/^Bearer\s+(\S+)$/i);

	if (!match) {
		return response.status(401).json({ error: true, message: 'Authentication required' });
	}

	const secret = process.env.JWT_SECRET;
	if (!secret) {
		return next(new Error('JWT_SECRET is not configured'));
	}

	let claims;
	try {
		claims = jwt.verify(match[1], secret);
	} catch {
		return response.status(401).json({ error: true, message: 'Invalid or expired authentication token' });
	}

	if (typeof claims === 'string' || !claims.id) {
		return response.status(401).json({ error: true, message: 'Invalid authentication token' });
	}

	request.user = claims;
	return next();
=======
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
>>>>>>> 209e3c227fe7b81c98e09fcb867039ca249750c9
}
