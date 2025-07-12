import apiClient from './client';
import { LoginForm, RegisterForm, AuthUser, User } from '@/types';
import Cookies from 'js-cookie';

export const authApi = {
  login: async (credentials: LoginForm) => {
    const response = await apiClient.post<{ access_token: string; user: User }>('/auth/login', credentials);
    
    // Guardar el token en cookies
    if (response.data.access_token) {
      Cookies.set('token', response.data.access_token, { expires: 7 }); // 7 días
    }
    
    return {
      data: {
        ...response.data.user,
        token: response.data.access_token
      }
    };
  },

  register: async (userData: RegisterForm) => {
    const response = await apiClient.post<{ access_token: string; user: User }>('/auth/register', {
      email: userData.email,
      password: userData.password,
      name: `${userData.firstName} ${userData.lastName}`
    });
    
    // Guardar el token en cookies
    if (response.data.access_token) {
      Cookies.set('token', response.data.access_token, { expires: 7 }); // 7 días
    }
    
    return {
      data: {
        ...response.data.user,
        token: response.data.access_token
      }
    };
  },

  logout: async () => {
    // Limpiar token de cookies
    Cookies.remove('token');
    return { data: null };
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<User>('/auth/profile');
    return response;
  },

  refreshToken: async () => {
    const response = await apiClient.post<{ access_token: string }>('/auth/refresh');
    return response;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post('/auth/reset-password', { token, password });
    return response;
  },
}; 