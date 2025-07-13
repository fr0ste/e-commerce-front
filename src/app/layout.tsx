import '../styles/globals.css';
import type { ReactNode } from 'react';
import Providers from './_components/Providers';
import AuthInit from './_components/AuthInit';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ConnectionStatus from '@/components/feedback/ConnectionStatus';

// Este layout es un Server Component, pero usa Providers, AuthInit, Navbar y Footer como Client Components
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col min-h-screen">
        {/* Providers, AuthInit, Navbar y Footer son Client Components */}
        <Providers>
          <AuthInit />
          <Navbar />
          <ConnectionStatus className="mx-4 mt-4" />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
} 