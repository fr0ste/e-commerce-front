import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
};

export default function Button({
  children,
  className,
  variant = 'primary',
  loading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded font-semibold transition-colors',
        {
          'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
          'bg-secondary-600 text-white hover:bg-secondary-700': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'opacity-50 cursor-not-allowed': loading || props.disabled,
        },
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
} 