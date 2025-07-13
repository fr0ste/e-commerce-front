import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container mx-auto py-20 text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
      <Link href="/" className="text-primary-600 hover:underline">Volver al inicio</Link>
    </main>
  );
} 