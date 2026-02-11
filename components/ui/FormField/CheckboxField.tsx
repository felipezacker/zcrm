import React, { useId } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';
import { AlertCircle } from 'lucide-react';
import { errorMessageStyles, hintStyles } from './styles';

export interface CheckboxFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> {
  label: string;
  error?: FieldError;
  hint?: string;
  registration?: UseFormRegisterReturn;
  containerClassName?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  error,
  hint,
  registration,
  containerClassName,
  ...props
}) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={containerClassName}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          id={id}
          className={cn(
            'w-4 h-4 rounded border-divider',
            'text-primary-600 focus:ring-primary-500',
            'bg-background-secondary',
            error && 'border-error'
          )}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...registration}
          {...props}
        />
        <span className="text-sm text-foreground-secondary">{label}</span>
      </label>
      {error && (
        <p id={errorId} className={errorMessageStyles} role="alert">
          <AlertCircle size={12} />
          <span>{error.message}</span>
        </p>
      )}
      {hint && !error && <p className={hintStyles}>{hint}</p>}
    </div>
  );
};
