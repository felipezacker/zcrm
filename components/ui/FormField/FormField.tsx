import React, { useId } from 'react';
import { FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { labelStyles, errorMessageStyles, hintStyles, getValidationState } from './styles';

export interface FormFieldProps {
  label: string;
  error?: FieldError;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  id?: string;
  showSuccessState?: boolean;
  isDirty?: boolean;
  isTouched?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  children,
  className,
  required,
  id,
  showSuccessState = false,
  isDirty,
  isTouched,
}) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const validationState = getValidationState(error, isDirty, isTouched);
  const showSuccess = showSuccessState && validationState === 'valid';

  return (
    <div className={className}>
      <label htmlFor={fieldId} className={cn(labelStyles, error && 'text-red-500')}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
            id: fieldId,
            'aria-invalid': error ? 'true' : undefined,
            'aria-describedby': cn(error && errorId, hint && !error && hintId) || undefined,
            'aria-required': required,
          });
        }
        return child;
      })}

      {error && (
        <p id={errorId} className={errorMessageStyles} role="alert" aria-live="polite">
          <AlertCircle size={12} />
          <span>{error.message}</span>
        </p>
      )}

      {showSuccess && (
        <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
          <CheckCircle2 size={12} />
          <span>Válido</span>
        </p>
      )}

      {hint && !error && !showSuccess && (
        <p id={hintId} className={hintStyles}>
          {hint}
        </p>
      )}
    </div>
  );
};
