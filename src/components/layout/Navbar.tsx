'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
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
      <Link href="/" className="text-xl font-bold text-primary-600">
        Tienda Online
      </Link>
      
      <div className="flex items-center gap-4">
        <Link href="/products" className="hover:underline">
          Productos
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link href="/cart" className="hover:underline">
              Carrito
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Hola, {user?.name || user?.email}
              </span>
              <Link href="/profile" className="hover:underline">
                Mi Perfil
              </Link>
              <Button 
                variant="secondary" 
                onClick={handleLogout} 
                className="text-sm"
                disabled={isLoading}
              >
                Cerrar Sesión
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hover:underline">
              Iniciar Sesión
            </Link>
            <Link href="/auth/register">
              <Button variant="primary" className="text-sm">
                Registrarse
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
} 