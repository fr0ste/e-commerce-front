'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-6 text-center text-gray-500 mt-10">
      <span>&copy; {new Date().getFullYear()} Tienda Online. Todos los derechos reservados.</span>
    </footer>
  );
} 