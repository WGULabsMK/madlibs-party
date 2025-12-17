import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg',
  secondary: 'bg-white hover:bg-gray-50 text-violet-600 border-2 border-violet-600',
  accent: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg',
  error: 'bg-red-500 hover:bg-red-600 text-white shadow-lg',
  ghost: 'bg-transparent hover:bg-gray-100 text-violet-600',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-colors cursor-pointer',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
