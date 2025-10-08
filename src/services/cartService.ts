import api from './api';
import { Cart, CreateOrder, Order } from '../types';
import { authService } from './authService';

export const cartService = {
  async getCart(): Promise<Cart> {
    const user = authService.getCurrentUser();
    console.log('🛒 [cartService] getCart called, user:', user);
    
    if (!user || !user.Id) {
      console.log('❌ [cartService] User not authenticated or no user ID');
      throw new Error('User not authenticated');
    }

    console.log('🛒 [cartService] Making API call to:', `/Cart`);
    const response = await api.get<Cart>(`/Cart`);
    console.log('✅ [cartService] Cart response:', response.data);
    return response.data;
  },

  async addToCart(courseId: number): Promise<boolean> {
    const user = authService.getCurrentUser();
    console.log('🛒 [cartService] addToCart called, user:', user);
    console.log('🛒 [cartService] courseId:', courseId);
    
    if (!user) throw new Error('User not authenticated');

    try {
      console.log('🛒 [cartService] Making API call to:', `/Cart/add`);
      const response = await api.post(`/Cart/add`, { courseId });
      console.log('✅ [cartService] Add to cart response:', response.status, response.data);
      return response.status === 200;
    } catch (error) {
      console.error('❌ [cartService] Error adding to cart:', error);
      throw error;
    }
  },

  async removeFromCart(courseId: number): Promise<boolean> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const response = await api.delete(`/Cart/remove/${courseId}`);
    return response.status === 200;
  },

  async clearCart(): Promise<boolean> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const response = await api.delete(`/Cart/clear`);
    return response.status === 200;
  },

  async createOrder(orderData: Omit<CreateOrder, 'userId'>): Promise<Order> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const response = await api.post<Order>('/Orders', {
      ...orderData,
      userId: user.Id
    });
    return response.data;
  }
};