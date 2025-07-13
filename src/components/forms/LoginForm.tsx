'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm as LoginFormType } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/feedback/ErrorMessage';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  const onSubmit = async (data: LoginFormType) => {
    setIsLoading(true);
    clearError();
    
    try {
      await login(data);
      // La redirección se maneja en el useEffect cuando isAuthenticated cambia
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
          <p className="text-gray-600 text-center mb-6">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        <ErrorMessage message={error} />

        <Input
          label="Email"
          type="email"
          {...register('email', {
            required: 'El email es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido',
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label="Contraseña"
          type="password"
          {...register('password', {
            required: 'La contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          })}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
        >
          Iniciar Sesión
        </Button>

        <div className="text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="/auth/register" className="text-primary-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
} 