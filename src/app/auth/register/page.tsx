import RegisterForm from '@/components/forms/RegisterForm';

// Evitar prerender ya que esta página usa APIs del navegador
export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex justify-center">
        <RegisterForm />
      </div>
    </main>
  );
} 