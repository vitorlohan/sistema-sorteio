import api from './api';
import type {
  ApiResponse,
  DrawTemplate,
  DrawType,
} from '../types';

export const templateService = {
  async create(template: { name: string; type: DrawType; config: object }) {
    const { data } = await api.post<ApiResponse<{ template: DrawTemplate }>>(
      '/templates',
      template
    );
    return data;
  },

  async getAll(type?: DrawType) {
    const query = type ? `?type=${type}` : '';
    const { data } = await api.get<ApiResponse<{ templates: DrawTemplate[] }>>(
      `/templates${query}`
    );
    return data;
  },

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<{ template: DrawTemplate }>>(
      `/templates/${id}`
    );
    return data;
  },

  async update(id: string, updates: { name?: string; config?: object }) {
    const { data } = await api.put<ApiResponse<{ template: DrawTemplate }>>(
      `/templates/${id}`,
      updates
    );
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete<ApiResponse>(`/templates/${id}`);
    return data;
  },
};
