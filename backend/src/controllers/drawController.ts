import { Request, Response } from 'express';
import { drawService } from '../services/drawService';
import { AuthRequest } from '../types';

export class DrawController {
  async drawNumbers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quantity, min, max, allowRepeat } = req.body;
      const results = await drawService.drawNumbers(
        { quantity, min, max, allowRepeat },
        req.userId
      );

      res.json({
        success: true,
        data: { results },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao realizar sorteio de números',
      });
    }
  }

  async drawNames(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { quantity, names, allowRepeat } = req.body;
      const results = await drawService.drawNames(
        { quantity, names, allowRepeat },
        req.userId
      );

      res.json({
        success: true,
        data: { results },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao realizar sorteio de nomes',
      });
    }
  }

  async drawRoulette(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { entries, colors } = req.body;
      const result = await drawService.drawRoulette(
        { entries, colors },
        req.userId
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao realizar sorteio de roleta',
      });
    }
  }

  async getHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const data = await drawService.getHistory(req.userId!, page, limit);

      res.json({
        success: true,
        data,
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao buscar histórico',
      });
    }
  }
}

export const drawController = new DrawController();
