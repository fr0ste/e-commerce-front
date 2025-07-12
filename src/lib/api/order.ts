import apiClient from './client';
import { Order, CheckoutForm } from '@/types';

export const orderApi = {
  createOrder: async (checkoutData: CheckoutForm) => {
    const response = await apiClient.post<Order>('/orders', checkoutData);
    return response;
  },

  getOrders: async () => {
    const response = await apiClient.get<Order[]>('/orders');
    return response;
  },

  getOrderById: async (orderId: string) => {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response;
  },

  cancelOrder: async (orderId: string) => {
    const response = await apiClient.post<Order>(`/orders/${orderId}/cancel`);
    return response;
  },

  getOrderTracking: async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}/tracking`);
    return response;
  },
}; 