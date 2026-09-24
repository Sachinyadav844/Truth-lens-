import { Router } from 'express'

const router = Router()
router.post('/login', (_request, response) => response.status(501).json({ error: 'Authentication is not configured yet.' }))
router.post('/signup', (_request, response) => response.status(501).json({ error: 'Authentication is not configured yet.' }))
export default router
