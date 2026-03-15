import api from './api';
import type {
  ApiResponse,
  User,
  AuthTokens,
} from '../types';

export const authService = {
  async register(name: string, email: string, password: string) {
    const { data } = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/register',
      { name, email, password }
    );
    return data;
  },

  async login(email: string, password: string) {
    const { data } = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/login',
      { email, password }
    );
    return data;
  },

  async getProfile() {
    const { data } = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
    return data;
  },

  async logout(refreshToken: string) {
    const { data } = await api.post<ApiResponse>('/auth/logout', { refreshToken });
    return data;
  },
};
