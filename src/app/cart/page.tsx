import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Evitar prerender ya que esta página verifica autenticación
export const dynamic = 'force-dynamic';

export default function CartPage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Carrito de Compras</h1>
        <p className="text-gray-600">Aquí se mostrarán los productos añadidos al carrito.</p>
      </main>
    </ProtectedRoute>
  );
} 