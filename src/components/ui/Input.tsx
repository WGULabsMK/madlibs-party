import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

interface BaseInputProps {
  label?: string;
  error?: string;
}

interface TextInputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  multiline?: false;
  onChange?: (value: string) => void;
}

interface TextareaProps extends BaseInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  multiline: true;
  rows?: number;
  onChange?: (value: string) => void;
}

type InputProps = TextInputProps | TextareaProps;

export function Input(props: InputProps) {
  const { label, error, className, onChange, ...rest } = props;

  const inputStyles = cn(
    'w-full px-4 py-3 text-base border-2 rounded-xl bg-white text-gray-900 outline-none transition-colors',
    error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20',
    className
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          {label}
        </label>
      )}
      {props.multiline ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          onChange={handleChange}
          className={cn(inputStyles, 'resize-y')}
          rows={props.rows ?? 3}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          onChange={handleChange}
          className={inputStyles}
        />
      )}
      {error && (
        <span className="block mt-1 text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
