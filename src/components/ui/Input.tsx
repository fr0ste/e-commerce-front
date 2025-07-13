import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="mb-4">
      {label && <label className="block mb-1 font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2',
          error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary-200',
          className
        )}
        {...props}
      />
      {error && <span className="text-sm text-red-500 mt-1 block">{error}</span>}
    </div>
  )
);

Input.displayName = 'Input';
export default Input; 