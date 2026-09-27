import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { connectDatabase } from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import checkRoutes from './routes/check.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const port = Number(process.env.PORT || 5000)

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/api/health', (_request, response) => {
  const connected = mongoose.connection.readyState === 1
  return response.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: connected ? 'connected' : 'unavailable'
  })
})

app.use('/api', (_request, response, next) => {
  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({ error: true, message: 'Database is temporarily unavailable' })
  }
  return next()
})
app.use('/api/auth', authRoutes)
app.use('/api/check', checkRoutes)
app.use('/api/checks', checkRoutes)

app.use((_request, _response, next) => {
  const error = new Error('Route not found')
  error.status = 404
  next(error)
})
app.use(errorHandler)

async function startServer() {
  try {
    await connectDatabase()
    console.info('MongoDB connected')
    app.listen(port, () => console.log(`Truth-lens API listening on port ${port}`))
  } catch (error) {
    const message = String(error.message || 'Unknown connection error')
      .replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, '[MongoDB URI redacted]')
      .replace(/_mongodb\._tcp\.[^\s]+/gi, '_mongodb._tcp.[redacted]')

    console.error('MongoDB connection failed:', {
      name: error.name || 'Error',
      message,
      code: error.code || error.cause?.code || 'n/a'
    })
    process.exit(1)
  }
}

startServer()