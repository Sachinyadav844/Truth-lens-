<<<<<<< HEAD
import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;
=======
import { Router } from 'express'
import { login, signup } from '../controllers/auth.controller.js'

const router = Router()
router.post('/login', login)
router.post('/signup', signup)
export default router
>>>>>>> 209e3c227fe7b81c98e09fcb867039ca249750c9
