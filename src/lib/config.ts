// Configuración centralizada de la aplicación
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const config = {
  // API Configuration
  api: {
    baseURL: API_URL,
    timeout: 10000,
    retryAttempts: 3,
  },
  
  // Auth Configuration
  auth: {
    tokenKey: 'token',
    tokenExpiry: 7, // días
    refreshThreshold: 5 * 60 * 1000, // 5 minutos antes de expirar
  },
  
  // App Configuration
  app: {
    name: 'Tienda Online',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: 3002, // Puerto del frontend
  },
  
  // Feature flags
  features: {
    enableAuth: true,
    enableCart: true,
    enableOrders: true,
    enableProfile: true,
  },
  
  // Debug mode
  debug: process.env.NODE_ENV === 'development',
};

// Función para verificar si el backend está disponible
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${config.api.baseURL}/health`, {
      method: 'GET',
      // timeout: 5000, // No soportado por fetch estándar
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
}

// Función para obtener la URL completa de un endpoint
export function getApiUrl(endpoint: string): string {
  const baseURL = config.api.baseURL.replace(/\/$/, ''); // Remover trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remover leading slash
  return `${baseURL}/${cleanEndpoint}`;
} 