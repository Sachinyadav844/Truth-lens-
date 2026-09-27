import dns from 'node:dns'
import mongoose from 'mongoose'

export async function connectDatabase() {
	if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
		return mongoose.connection
	}

	const mongoUri = process.env.MONGO_URI
	if (!mongoUri) throw new Error('MONGO_URI is not configured')

	try {
		dns.setServers(['8.8.8.8', '1.1.1.1'])
	} catch {
		// Keep the app running if the runtime cannot override the resolver.
	}

	return mongoose.connect(mongoUri, {
		serverSelectionTimeoutMS: 20000,
		maxPoolSize: 10,
		retryWrites: true
	})
}
