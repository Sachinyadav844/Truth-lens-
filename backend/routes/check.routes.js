import { Router } from 'express'
import { createCheck, getCheckById, getHistory } from '../controllers/check.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()
router.use(requireAuth)
router.post('/', createCheck)
router.get('/history', getHistory)
router.get('/:id', getCheckById)
export default router
