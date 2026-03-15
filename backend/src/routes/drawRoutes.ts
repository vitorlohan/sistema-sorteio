import { Router, Request, Response } from 'express';
import { drawController } from '../controllers/drawController';
import { authenticate, optionalAuth } from '../middlewares/auth';
import { drawLimiter } from '../middlewares/rateLimiter';
import { handleValidationErrors } from '../middlewares/errorHandler';
import {
  numberDrawValidation,
  nameDrawValidation,
  rouletteDrawValidation,
} from '../middlewares/validation';

const router = Router();

// POST /api/draw/numbers - Sorteio de números (auth opcional)
router.post(
  '/numbers',
  drawLimiter,
  optionalAuth,
  numberDrawValidation,
  handleValidationErrors,
  (req: Request, res: Response) => drawController.drawNumbers(req, res)
);

// POST /api/draw/names - Sorteio de nomes (auth opcional)
router.post(
  '/names',
  drawLimiter,
  optionalAuth,
  nameDrawValidation,
  handleValidationErrors,
  (req: Request, res: Response) => drawController.drawNames(req, res)
);

// POST /api/draw/roulette - Sorteio de roleta (auth opcional)
router.post(
  '/roulette',
  drawLimiter,
  optionalAuth,
  rouletteDrawValidation,
  handleValidationErrors,
  (req: Request, res: Response) => drawController.drawRoulette(req, res)
);

// GET /api/draw/history - Histórico de sorteios (autenticado)
router.get(
  '/history',
  authenticate,
  (req: Request, res: Response) => drawController.getHistory(req, res)
);

export default router;
