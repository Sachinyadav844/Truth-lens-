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
}
