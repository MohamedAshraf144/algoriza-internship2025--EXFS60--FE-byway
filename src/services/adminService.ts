import api from './api';
import { PlatformStats, User, Order } from '../types';

export const adminService = {
  async getPlatformStats(): Promise<PlatformStats> {
    const response = await api.get<PlatformStats>('/Admin/stats');
    return response.data;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/Admin/users');
    return response.data;
  },

  async getAllOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>('/Admin/orders');
    return response.data;
  },

  // Admin Setup endpoints
  async createAdmin(adminData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<any> {
    const response = await api.post('/AdminSetup/create-admin', adminData);
    return response.data;
  },

  async checkAdminExists(): Promise<{ adminExists: boolean }> {
    const response = await api.get('/AdminSetup/check-admin');
    return response.data;
  },

  async deleteAdmin(): Promise<any> {
    const response = await api.delete('/AdminSetup/delete-admin');
    return response.data;
  }
};