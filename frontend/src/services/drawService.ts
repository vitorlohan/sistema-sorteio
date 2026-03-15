import api from './api';
import type {
  ApiResponse,
  NumberDrawConfig,
  NameDrawConfig,
  RouletteDrawConfig,
  RouletteResult,
  PaginatedData,
  DrawResult,
} from '../types';

export const drawService = {
  async drawNumbers(config: NumberDrawConfig) {
    const { data } = await api.post<ApiResponse<{ results: number[] }>>(
      '/draw/numbers',
      config
    );
    return data;
  },

  async drawNames(config: NameDrawConfig) {
    const { data } = await api.post<ApiResponse<{ results: string[] }>>(
      '/draw/names',
      config
    );
    return data;
  },

  async drawRoulette(config: RouletteDrawConfig) {
    const { data } = await api.post<ApiResponse<RouletteResult>>(
      '/draw/roulette',
      config
    );
    return data;
  },

  async getHistory(page: number = 1, limit: number = 20) {
    const { data } = await api.get<ApiResponse<PaginatedData<DrawResult>>>(
      `/draw/history?page=${page}&limit=${limit}`
    );
    return data;
  },
};
