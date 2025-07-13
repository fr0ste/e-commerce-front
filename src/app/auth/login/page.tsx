import LoginForm from '@/components/forms/LoginForm';

// Evitar prerender ya que esta página usa APIs del navegador
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </main>
  );
} 