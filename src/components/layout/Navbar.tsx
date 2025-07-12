'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="w-full bg-white shadow-soft py-4 px-6 flex items-center justify-between">
      <a href="/" className="text-xl font-bold text-primary-600">Tienda Online</a>
      
      <div className="flex items-center gap-4">
        <a href="/products" className="hover:underline">Productos</a>
        <a href="/cart" className="hover:underline">Carrito</a>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hola, {user?.name || user?.email}</span>
            <a href="/profile" className="hover:underline">Mi Perfil</a>
            <Button variant="secondary" onClick={handleLogout} className="text-sm">
              Cerrar Sesión
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <a href="/auth/login" className="hover:underline">Iniciar Sesión</a>
            <a href="/auth/register">
              <Button variant="primary" className="text-sm">
                Registrarse
              </Button>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
} 