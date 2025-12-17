import type { ReactNode } from 'react';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';
import type { AlertVariant } from '@/types';

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; icon: ReactNode }> = {
  info: {
    bg: 'bg-violet-50',
    border: 'border-l-violet-500',
    icon: <Info className="w-5 h-5 text-violet-500" />,
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-l-emerald-500',
    icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-l-amber-500',
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-l-red-500',
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  },
};

export function Alert({ children, variant = 'info', onClose, className }: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4 rounded-xl border-l-4 mb-4',
        styles.bg,
        styles.border,
        className
      )}
    >
      {styles.icon}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
