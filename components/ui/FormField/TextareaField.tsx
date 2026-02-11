import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';
import { FormField } from './FormField';
import { baseInputStyles, errorInputStyles } from './styles';

export interface TextareaFieldProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className'
> {
  label: string;
  error?: FieldError;
  hint?: string;
  registration?: UseFormRegisterReturn;
  containerClassName?: string;
  textareaClassName?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  error,
  hint,
  registration,
  containerClassName,
  textareaClassName,
  required,
  ...props
}) => (
  <FormField
    label={label}
    error={error}
    hint={hint}
    className={containerClassName}
    required={required}
  >
    <textarea
      className={cn(
        baseInputStyles,
        'min-h-[80px] resize-y',
        error && errorInputStyles,
        textareaClassName
      )}
      {...registration}
      {...props}
    />
  </FormField>
);
