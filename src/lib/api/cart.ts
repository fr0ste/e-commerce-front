import apiClient from './client';
import { Cart } from '@/types';

export const cartApi = {
  getCart: async () => {
    const response = await apiClient.get<Cart>('/cart');
    return response;
  },

  addToCart: async (productId: string, quantity: number) => {
    const response = await apiClient.post<Cart>('/cart/items', {
      productId,
      quantity,
    });
    return response;
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await apiClient.put<Cart>(`/cart/items/${itemId}`, {
      quantity,
    });
    return response;
  },

  removeFromCart: async (itemId: string) => {
    const response = await apiClient.delete(`/cart/items/${itemId}`);
    return response;
  },

  clearCart: async () => {
    const response = await apiClient.delete('/cart');
    return response;
  },

  applyCoupon: async (couponCode: string) => {
    const response = await apiClient.post<Cart>('/cart/coupon', {
      code: couponCode,
    });
    return response;
  },

  removeCoupon: async () => {
    const response = await apiClient.delete('/cart/coupon');
    return response;
  },
}; 