'use client';

import { useEffect } from 'react';
import { useAuth } from './useAuth';
import Cookies from 'js-cookie';

export function useAuthInit() {
  const { getCurrentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    const token = Cookies.get('token');
    
    // Si hay token pero no está autenticado, obtener el usuario actual
    if (token && !isAuthenticated) {
      getCurrentUser();
    }
  }, [getCurrentUser, isAuthenticated]);
} 