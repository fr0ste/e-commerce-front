import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '@/lib/config';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Solo manejar errores de autenticación, no errores de red o servidor
    if (error.response?.status === 401) {
      // Clear token and redirect to login only if we're not already on auth pages
      Cookies.remove('token');
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
        window.location.href = '/auth/login';
      }
    }
    
    // Para errores 404, no hacer nada especial - dejar que cada componente maneje
    // No redirigir automáticamente para evitar loops
    
    // Log error en modo debug
    if (process.env.NODE_ENV === 'development') {
      console.warn('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 