import { Router, Request, Response } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';
import { handleValidationErrors } from '../middlewares/errorHandler';
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
} from '../middlewares/validation';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  registerValidation,
  handleValidationErrors,
  (req: Request, res: Response) => authController.register(req, res)
);

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  loginValidation,
  handleValidationErrors,
  (req: Request, res: Response) => authController.login(req, res)
);

// POST /api/auth/refresh
router.post(
  '/refresh',
  refreshTokenValidation,
  handleValidationErrors,
  (req: Request, res: Response) => authController.refreshToken(req, res)
);

// POST /api/auth/logout
router.post(
  '/logout',
  authenticate,
  (req: Request, res: Response) => authController.logout(req, res)
);

// POST /api/auth/logout-all
router.post(
  '/logout-all',
  authenticate,
  (req: Request, res: Response) => authController.logoutAll(req, res)
);

// GET /api/auth/profile
router.get(
  '/profile',
  authenticate,
  (req: Request, res: Response) => authController.getProfile(req, res)
);

export default router;
