import api from './api';
import { Category } from '../types';

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    console.log('🔍 [categoryService] Fetching categories...');
    const response = await api.get<Category[]>('/Categories');
    console.log('🔍 [categoryService] Categories response:', response.data);
    return response.data;
  },

  async getCategoryById(id: number): Promise<Category> {
    const response = await api.get<Category>(`/Categories/${id}`);
    return response.data;
  },

  async createCategory(categoryData: FormData): Promise<Category> {
    const response = await api.post<Category>('/Categories', categoryData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateCategory(id: number, categoryData: FormData): Promise<Category> {
    const response = await api.put<Category>(`/Categories/${id}`, categoryData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/Categories/${id}`);
  },

  async seedCategories(): Promise<void> {
    await api.post('/Categories/seed');
  }
};