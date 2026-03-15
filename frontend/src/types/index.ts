export enum DrawType {
  NUMBER = 'number',
  NAME = 'name',
  ROULETTE = 'roulette',
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface NumberDrawConfig {
  quantity: number;
  min: number;
  max: number;
  allowRepeat: boolean;
}

export interface NameDrawConfig {
  quantity: number;
  names: string[];
  allowRepeat: boolean;
}

export interface RouletteDrawConfig {
  entries: string[];
  colors: string[];
}

export interface DrawTemplate {
  _id: string;
  userId: string;
  name: string;
  type: DrawType;
  config: NumberDrawConfig | NameDrawConfig | RouletteDrawConfig;
  createdAt: string;
  updatedAt: string;
}

export interface DrawResult {
  _id: string;
  type: DrawType;
  config: NumberDrawConfig | NameDrawConfig | RouletteDrawConfig;
  results: (string | number)[];
  createdAt: string;
}

export interface RouletteResult {
  winner: string;
  winnerIndex: number;
  angle: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: { field: string; message: string }[];
}

export interface PaginatedData<T> {
  results: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
