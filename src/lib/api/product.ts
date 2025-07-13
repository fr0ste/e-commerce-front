import apiClient from './client';
import { Product, ProductFilters, PaginatedResponse, ProductCategory } from '@/types';

export const productApi = {
  getProducts: async (filters: ProductFilters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiClient.get<PaginatedResponse<Product>>(`/products?${params.toString()}`);
    return response;
  },

  getProductById: async (productId: string) => {
    const response = await apiClient.get<Product>(`/products/${productId}`);
    return response;
  },

  getFeaturedProducts: async () => {
    const response = await apiClient.get<Product[]>('/products/featured');
    return response;
  },

  getCategories: async () => {
    const response = await apiClient.get<ProductCategory[]>('/products/categories');
    return response;
  },

  searchProducts: async (query: string) => {
    const response = await apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
    return response;
  },

  getProductsByCategory: async (categoryId: string) => {
    const response = await apiClient.get<Product[]>(`/products/category/${categoryId}`);
    return response;
  },

  getRelatedProducts: async (productId: string) => {
    const response = await apiClient.get<Product[]>(`/products/${productId}/related`);
    return response;
  },
}; 