import { Request } from 'express';

// Tipos de sorteio
export enum DrawType {
  NUMBER = 'number',
  NAME = 'name',
  ROULETTE = 'roulette',
}

// Interface do usuário
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Configuração de sorteio de números
export interface INumberDrawConfig {
  quantity: number;
  min: number;
  max: number;
  allowRepeat: boolean;
}

// Configuração de sorteio de nomes
export interface INameDrawConfig {
  quantity: number;
  names: string[];
  allowRepeat: boolean;
}

// Configuração de roleta
export interface IRouletteDrawConfig {
  entries: string[];
  colors: string[];
}

// Union type para configurações
export type DrawConfig = INumberDrawConfig | INameDrawConfig | IRouletteDrawConfig;

// Interface do template de sorteio
export interface IDrawTemplate {
  _id: string;
  userId: string;
  name: string;
  type: DrawType;
  config: DrawConfig;
  createdAt: Date;
  updatedAt: Date;
}

// Interface do resultado de sorteio
export interface IDrawResult {
  _id: string;
  userId?: string;
  type: DrawType;
  config: DrawConfig;
  results: (string | number)[];
  createdAt: Date;
}

// Request autenticado
export interface AuthRequest extends Request {
  userId?: string;
}

// Payload do JWT
export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

// Resposta padrão da API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Tokens de autenticação
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
