'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import Cookies from 'js-cookie';

export function useAuthInit() {
  const { getCurrentUser, isAuthenticated } = useAuth();
  const hasAttemptedAuth = useRef(false);

  useEffect(() => {
    const token = Cookies.get('token');
    
    // Solo intentar autenticar una vez por sesión si hay token
    if (token && !isAuthenticated && !hasAttemptedAuth.current) {
      hasAttemptedAuth.current = true;
      getCurrentUser().catch((error) => {
        console.warn('Failed to get current user:', error.message);
        // Si falla la autenticación, limpiar el token inválido
        if (error.response?.status === 401 || error.response?.status === 404) {
          Cookies.remove('token');
        }
      });
    }
  }, [getCurrentUser, isAuthenticated]);
} 