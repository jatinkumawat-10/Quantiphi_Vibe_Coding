import { Router } from 'express';
import { register, login, logout, me } from './auth.controller.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { validateRequest } from '../../middlewares/validateRequest.js';
import { registerSchema, loginSchema } from './auth.validation.js';

const router = Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

// Protected routes
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, me);

export default router;
