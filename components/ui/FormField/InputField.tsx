import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';
import { FormField } from './FormField';
import { baseInputStyles, errorInputStyles, successInputStyles, getValidationState } from './styles';

export interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label: string;
  error?: FieldError;
  hint?: string;
  registration?: UseFormRegisterReturn;
  containerClassName?: string;
  inputClassName?: string;
  showSuccessState?: boolean;
  isDirty?: boolean;
  isTouched?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  hint,
  registration,
  containerClassName,
  inputClassName,
  showSuccessState,
  isDirty,
  isTouched,
  required,
  ...props
}) => {
  const validationState = getValidationState(error, isDirty, isTouched);

  return (
    <FormField
      label={label}
      error={error}
      hint={hint}
      className={containerClassName}
      required={required}
      showSuccessState={showSuccessState}
      isDirty={isDirty}
      isTouched={isTouched}
    >
      <input
        className={cn(
          baseInputStyles,
          validationState === 'invalid' && errorInputStyles,
          validationState === 'valid' && showSuccessState && successInputStyles,
          inputClassName
        )}
        {...registration}
        {...props}
      />
    </FormField>
  );
};
