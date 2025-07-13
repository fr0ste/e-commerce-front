// Evitar prerender ya que esta página usa datos del usuario
export const dynamic = 'force-dynamic';

export default function OrdersPage() {
  return (
    <main className="container mx-auto py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Mis Pedidos</h1>
      <p className="text-gray-600">Aquí se mostrará el historial de pedidos del usuario.</p>
    </main>
  );
} 