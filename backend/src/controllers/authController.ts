import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { AuthRequest } from '../types';

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const { user, tokens } = await authService.register(name, email, password);

      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: { user, tokens },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao registrar usuário',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, tokens } = await authService.login(email, password);

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: { user, tokens },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao realizar login',
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: { tokens },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao renovar token',
      });
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      await authService.logout(req.userId!, refreshToken);

      res.json({
        success: true,
        message: 'Logout realizado com sucesso',
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao realizar logout',
      });
    }
  }

  async logoutAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      await authService.logoutAll(req.userId!);

      res.json({
        success: true,
        message: 'Todas as sessões foram encerradas',
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao encerrar sessões',
      });
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getProfile(req.userId!);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: { user },
      });
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erro ao buscar perfil',
      });
    }
  }
}

export const authController = new AuthController();
