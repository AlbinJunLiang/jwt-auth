// routes/auth.routes.js
import express from 'express';

import { recoverPassword, login, refresh, register, updateUser, resetPassword } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, resetPasswordSchema } from '../schemas/auth.schema.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', validate(registerSchema), register);
router.post('/refresh', refresh);
router.put('/', authMiddleware, updateUser);
router.post('/recover', recoverPassword);
router.post('/reset', validate(resetPasswordSchema), authMiddleware, requireRole('user'), resetPassword);


export default router;
