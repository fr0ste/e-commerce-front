import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Evitar prerender ya que esta página verifica autenticación
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
        <p className="text-gray-600">Aquí se podrá ver y editar la información personal del usuario.</p>
      </main>
    </ProtectedRoute>
  );
} 