import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: (SelectOption | string)[];
  onChange?: (value: string) => void;
}

export function Select({ label, value, onChange, options, className, ...props }: SelectProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl bg-white text-gray-900 cursor-pointer outline-none',
          'focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors',
          className
        )}
        {...props}
      >
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value;
          const optLabel = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}
