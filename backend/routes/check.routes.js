import { Router } from 'express'
import { createCheck, getCheckById, getCheckHistory } from '../controllers/check.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()
router.get('/history', requireAuth, getCheckHistory)
router.get('/:id', requireAuth, getCheckById)
router.post('/', requireAuth, createCheck)
export default router
