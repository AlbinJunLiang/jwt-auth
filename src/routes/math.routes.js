import { Router } from 'express';
import { sumar } from '../controllers/math.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();


router.post('/sumar',authMiddleware, sumar);


export default router;
