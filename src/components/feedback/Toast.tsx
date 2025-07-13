import { useEffect } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
};

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const color =
    type === 'success' ? 'bg-green-100 text-green-700' :
    type === 'error' ? 'bg-red-100 text-red-700' :
    type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
    'bg-blue-100 text-blue-700';

  return (
    <div className={`px-4 py-2 rounded shadow-soft mb-2 ${color}`}>
      {message}
    </div>
  );
} 