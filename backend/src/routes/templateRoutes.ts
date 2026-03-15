import { Router, Request, Response } from 'express';
import { templateController } from '../controllers/templateController';
import { authenticate } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/errorHandler';
import { templateValidation, idValidation } from '../middlewares/validation';

const router = Router();

// Todas as rotas de templates requerem autenticação
router.use(authenticate);

// POST /api/templates - Criar modelo
router.post(
  '/',
  templateValidation,
  handleValidationErrors,
  (req: Request, res: Response) => templateController.create(req, res)
);

// GET /api/templates - Listar modelos
router.get(
  '/',
  (req: Request, res: Response) => templateController.getAll(req, res)
);

// GET /api/templates/:id - Buscar modelo por ID
router.get(
  '/:id',
  idValidation,
  handleValidationErrors,
  (req: Request, res: Response) => templateController.getById(req, res)
);

// PUT /api/templates/:id - Atualizar modelo
router.put(
  '/:id',
  idValidation,
  handleValidationErrors,
  (req: Request, res: Response) => templateController.update(req, res)
);

// DELETE /api/templates/:id - Excluir modelo
router.delete(
  '/:id',
  idValidation,
  handleValidationErrors,
  (req: Request, res: Response) => templateController.delete(req, res)
);

export default router;
