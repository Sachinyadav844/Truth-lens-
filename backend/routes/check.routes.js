import { Router } from 'express'
<<<<<<< HEAD
import { createCheck, getCheckById, getCheckHistory } from '../controllers/check.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()
router.get('/history', requireAuth, getCheckHistory)
router.get('/:id', requireAuth, getCheckById)
router.post('/', requireAuth, createCheck)
=======
import { createCheck, getCheckById, getHistory } from '../controllers/check.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()
router.use(requireAuth)
router.post('/', createCheck)
router.get('/history', getHistory)
router.get('/:id', getCheckById)
>>>>>>> 209e3c227fe7b81c98e09fcb867039ca249750c9
export default router
