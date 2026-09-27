import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes.js'
import checkRoutes from './routes/check.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }))
app.use(express.json())

<<<<<<< HEAD
// Database connection logic
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("MongoDB Connection Error: ", err));

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/check', checkRoutes)
app.use('/api/checks', checkRoutes)
=======
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/check', checkRoutes)
>>>>>>> 209e3c227fe7b81c98e09fcb867039ca249750c9

app.use((_request, _response, next) => {
  const error = new Error('Route not found')
  error.status = 404
  next(error)
})
app.use(errorHandler)

app.listen(port, () => console.log(`Truth-lens API listening on port ${port}`))