'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { RegisterForm as RegisterFormType } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/feedback/ErrorMessage';

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser, error, clearError } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormType>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormType) => {
    setIsLoading(true);
    clearError();
    
    try {
      await registerUser(data);
      router.push('/');
    } catch (err) {
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>
          <p className="text-gray-600 text-center mb-6">
            Completa el formulario para crear tu cuenta
          </p>
        </div>

        <ErrorMessage message={error} />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            {...register('firstName', {
              required: 'El nombre es requerido',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres',
              },
            })}
            error={errors.firstName?.message}
          />

          <Input
            label="Apellido"
            {...register('lastName', {
              required: 'El apellido es requerido',
              minLength: {
                value: 2,
                message: 'El apellido debe tener al menos 2 caracteres',
              },
            })}
            error={errors.lastName?.message}
          />
        </div>

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

        <Input
          label="Confirmar Contraseña"
          type="password"
          {...register('confirmPassword', {
            required: 'Debes confirmar la contraseña',
            validate: (value) =>
              value === password || 'Las contraseñas no coinciden',
          })}
          error={errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
        >
          Crear Cuenta
        </Button>

        <div className="text-center">
          <p className="text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <a href="/auth/login" className="text-primary-600 hover:underline">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
} 