import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes.js'
import checkRoutes from './routes/check.routes.js'

const app = express()
const port = process.env.PORT || 4000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// Database connection logic
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("MongoDB Connection Error: ", err));

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/checks', checkRoutes)

app.listen(port, () => console.log(`Truth-lens API listening on port ${port}`))