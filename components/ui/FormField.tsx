/**
 * Reusable form field components with consistent styling, error handling, and ARIA accessibility
 *
 * Features:
 * - ARIA attributes for screen readers
 * - Real-time validation feedback
 * - Consistent error styling
 * - Loading states
 */
import React, { useId } from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils/cn';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// ============ BASE STYLES ============
// Mobile-first responsive design with design tokens

const baseInputStyles = cn(
  'w-full bg-[var(--color-background-secondary)]',
  'border border-[var(--color-border)]',
  'rounded-lg px-3 py-2 text-xs xs:text-sm sm:px-4 sm:py-2.5',
  'text-[var(--color-foreground)]',
  'outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
  'transition-all duration-200',
  'placeholder:text-[var(--color-foreground-tertiary)]',
  'min-h-[36px] xs:min-h-[40px] sm:min-h-[44px]' // Touch targets 44px+
);

const errorInputStyles =
  'border-[var(--color-error)] focus:ring-[var(--color-error)] bg-[var(--color-error)]/10';
const successInputStyles = 'border-[var(--color-success)] focus:ring-[var(--color-success)]';

const labelStyles = 'block text-xs xs:text-sm font-bold text-[var(--color-foreground-secondary)] uppercase mb-1 sm:mb-2';
const errorMessageStyles = 'text-xs sm:text-sm text-[var(--color-error)] mt-1 flex items-center gap-1';
const hintStyles = 'text-[10px] xs:text-xs text-[var(--color-foreground-tertiary)] mt-1';

// ============ VALIDATION STATE ============

type ValidationState = 'idle' | 'valid' | 'invalid';

const getValidationState = (
  error?: FieldError,
  isDirty?: boolean,
  isTouched?: boolean
): ValidationState => {
  if (error) return 'invalid';
  if (isDirty && isTouched && !error) return 'valid';
  return 'idle';
};

// ============ FORM FIELD WRAPPER ============

interface FormFieldProps {
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

/**
 * Componente React `FormField`.
 *
 * @param {FormFieldProps} {
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
} - Parâmetro `{
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
}`.
 * @returns {Element} Retorna um valor do tipo `Element`.
 */
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

      {/* Clone children to add ARIA attributes */}
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            id: fieldId,
            'aria-invalid': error ? 'true' : undefined,
            'aria-describedby': cn(error && errorId, hint && !error && hintId) || undefined,
            'aria-required': required,
          });
        }
        return child;
      })}

      {/* Error message with icon */}
      {error && (
        <p id={errorId} className={errorMessageStyles} role="alert" aria-live="polite">
          <AlertCircle size={12} />
          <span>{error.message}</span>
        </p>
      )}

      {/* Success indicator */}
      {showSuccess && (
        <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
          <CheckCircle2 size={12} />
          <span>Válido</span>
        </p>
      )}

      {/* Hint text */}
      {hint && !error && !showSuccess && (
        <p id={hintId} className={hintStyles}>
          {hint}
        </p>
      )}
    </div>
  );
};

// ============ INPUT FIELD ============

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
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

/**
 * Componente React `InputField`.
 *
 * @param {InputFieldProps} {
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
} - Parâmetro `{
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
}`.
 * @returns {Element} Retorna um valor do tipo `Element`.
 */
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

// ============ TEXTAREA FIELD ============

interface TextareaFieldProps extends Omit<
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

/**
 * Componente React `TextareaField`.
 *
 * @param {TextareaFieldProps} {
  label,
  error,
  hint,
  registration,
  containerClassName,
  textareaClassName,
  required,
  ...props
} - Parâmetro `{
  label,
  error,
  hint,
  registration,
  containerClassName,
  textareaClassName,
  required,
  ...props
}`.
 * @returns {Element} Retorna um valor do tipo `Element`.
 */
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

// ============ SELECT FIELD ============

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectFieldProps extends Omit<
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

/**
 * Componente React `SelectField`.
 *
 * @param {SelectFieldProps} {
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
} - Parâmetro `{
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
}`.
 * @returns {Element} Retorna um valor do tipo `Element`.
 */
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

// ============ CHECKBOX FIELD ============

interface CheckboxFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> {
  label: string;
  error?: FieldError;
  hint?: string;
  registration?: UseFormRegisterReturn;
  containerClassName?: string;
}

/**
 * Componente React `CheckboxField`.
 *
 * @param {CheckboxFieldProps} {
  label,
  error,
  hint,
  registration,
  containerClassName,
  ...props
} - Parâmetro `{
  label,
  error,
  hint,
  registration,
  containerClassName,
  ...props
}`.
 * @returns {Element} Retorna um valor do tipo `Element`.
 */
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

// ============ SUBMIT BUTTON ============

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

const buttonVariants = {
  primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-lg shadow-[var(--color-primary)]/20',
  secondary: 'bg-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-700)] shadow-lg shadow-[var(--color-neutral-600)]/20',
  danger: 'bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] shadow-lg shadow-[var(--color-error)]/20',
};

/**
 * Componente React `SubmitButton`.
 *
 * @param {SubmitButtonProps} {
  children,
  isLoading,
  loadingText = 'Salvando...',
  disabled,
  className,
  variant = 'primary',
  ...props
} - Parâmetro `{
  children,
  isLoading,
  loadingText = 'Salvando...',
  disabled,
  className,
  variant = 'primary',
  ...props
}`.
 * @returns {Element} Retorna um valor do tipo `Element`.
 */
export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading,
  loadingText = 'Salvando...',
  disabled,
  className,
  variant = 'primary',
  ...props
}) => (
  <button
    type="submit"
    disabled={disabled || isLoading}
    aria-busy={isLoading}
    className={cn(
      'w-full text-white font-bold py-2 xs:py-2.5 sm:py-3 rounded-lg',
      'text-sm xs:text-base',
      'min-h-[40px] xs:min-h-[44px] sm:min-h-[48px]',
      'shadow-lg transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      buttonVariants[variant],
      className
    )}
    {...props}
  >
    {isLoading ? (
      <span className="flex items-center justify-center gap-2">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        {loadingText}
      </span>
    ) : (
      children
    )}
  </button>
);

// ============ FORM ERROR SUMMARY ============

interface FormErrorSummaryProps {
  errors: Record<string, FieldError | undefined>;
  className?: string;
}

/**
 * Componente React `FormErrorSummary`.
 *
 * @param {FormErrorSummaryProps} { errors, className } - Parâmetro `{ errors, className }`.
 * @returns {Element | null} Retorna um valor do tipo `Element | null`.
 */
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
