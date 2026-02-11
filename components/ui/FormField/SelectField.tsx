import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';
import { FormField } from './FormField';
import { baseInputStyles, errorInputStyles } from './styles';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'className'
> {
  label: string;
  options: SelectOption[];
  error?: FieldError;
  hint?: string;
  registration?: UseFormRegisterReturn;
  placeholder?: string;
  containerClassName?: string;
  selectClassName?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  error,
  hint,
  registration,
  placeholder,
  containerClassName,
  selectClassName,
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
    <select
      className={cn(baseInputStyles, error && errorInputStyles, selectClassName)}
      {...registration}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  </FormField>
);
