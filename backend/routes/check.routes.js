import { Router } from 'express'
import { createCheck } from '../controllers/check.controller.js'

const router = Router()
router.post('/', createCheck)
export default router
