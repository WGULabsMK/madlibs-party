import type { ReactNode } from 'react';
import { cn } from '@/utils/helpers';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'accent';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-brand-blue/10 text-brand-blue',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  accent: 'bg-orange-100 text-orange-700',
};

export function Badge({ children, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
