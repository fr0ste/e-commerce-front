import Link from 'next/link';

export default function ErrorPage() {
  return (
    <main className="container mx-auto py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">¡Vaya! Algo salió mal</h1>
      <p className="text-lg text-gray-600 mb-8">Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.</p>
      <Link href="/" className="text-primary-600 hover:underline">Volver al inicio</Link>
    </main>
  );
} 