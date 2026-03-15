import { Response } from 'express';
import { templateService } from '../services/templateService';
import { AuthRequest, DrawType } from '../types';

export class TemplateController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, type, config } = req.body;
      const template = await templateService.create(
        req.userId!,
        name,
        type,
        config
      );

      res.status(201).json({
        success: true,
        message: 'Modelo criado com sucesso',
        data: { template },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao criar modelo',
      });
    }
  }

  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const type = req.query.type as DrawType | undefined;
      let templates;

      if (type && Object.values(DrawType).includes(type)) {
        templates = await templateService.getByType(req.userId!, type);
      } else {
        templates = await templateService.getAll(req.userId!);
      }

      res.json({
        success: true,
        data: { templates },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao buscar modelos',
      });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const template = await templateService.getById(req.userId!, req.params.id as string);
      if (!template) {
        res.status(404).json({
          success: false,
          message: 'Modelo não encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: { template },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao buscar modelo',
      });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, config } = req.body;
      const template = await templateService.update(req.userId!, req.params.id as string, {
        name,
        config,
      });

      res.json({
        success: true,
        message: 'Modelo atualizado com sucesso',
        data: { template },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao atualizar modelo',
      });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await templateService.delete(req.userId!, req.params.id as string);

      res.json({
        success: true,
        message: 'Modelo excluído com sucesso',
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao excluir modelo',
      });
    }
  }
}

export const templateController = new TemplateController();
