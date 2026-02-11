import React from 'react';
import { FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';
import { AlertCircle } from 'lucide-react';

export interface FormErrorSummaryProps {
  errors: Record<string, FieldError | undefined>;
  className?: string;
}

export const FormErrorSummary: React.FC<FormErrorSummaryProps> = ({ errors, className }) => {
  const errorList = Object.entries(errors).filter(
    (entry): entry is [string, FieldError] => entry[1] !== undefined
  );

  if (errorList.length === 0) return null;

  return (
    <div
      className={cn(
        'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
        'rounded-lg p-3 mb-4',
        className
      )}
      role="alert"
      aria-labelledby="form-errors-heading"
    >
      <h3
        id="form-errors-heading"
        className="text-sm font-bold text-red-700 dark:text-red-400 mb-2"
      >
        Por favor, corrija os seguintes erros:
      </h3>
      <ul className="list-disc list-inside space-y-1">
        {errorList.map(([field, error]) => (
          <li key={field} className="text-xs text-red-600 dark:text-red-300">
            {error.message}
          </li>
        ))}
      </ul>
    </div>
  );
};
