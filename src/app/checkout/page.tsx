import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <main className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Finalizar Compra</h1>
        <p className="text-gray-600">Aquí se gestionará el proceso de compra y pago.</p>
      </main>
    </ProtectedRoute>
  );
} 