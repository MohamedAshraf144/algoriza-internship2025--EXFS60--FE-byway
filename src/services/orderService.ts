import api from './api';
import { Order } from '../types';
import { authService } from './authService';

export const orderService = {
  async getUserOrders(): Promise<Order[]> {
    const user = authService.getCurrentUser();
    console.log('🛒 [orderService] getUserOrders called for user:', user);
    
    if (!user || !user.Id) {
      throw new Error('User not authenticated');
    }

    console.log('🛒 [orderService] Making API call to:', `/orders/user/${user.Id}`);
    const response = await api.get<Order[]>(`/orders/user/${user.Id}`);
    console.log('✅ [orderService] Orders response:', response.data);
    return response.data;
  },

  async getOrderById(orderId: number): Promise<Order> {
    const response = await api.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  async createOrder(paymentMethod: string, notes?: string): Promise<Order> {
    const user = authService.getCurrentUser();
    if (!user || !user.Id) {
      throw new Error('User not authenticated');
    }

    const response = await api.post<Order>('/orders', {
      userId: user.Id,
      paymentMethod,
      notes
    });
    return response.data;
  }
};