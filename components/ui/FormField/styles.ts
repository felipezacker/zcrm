import { cn } from '@/lib/utils/cn';
import { FieldError } from 'react-hook-form';

// Mobile-first responsive design with design tokens
export const baseInputStyles = cn(
  'w-full bg-[var(--color-background-secondary)]',
  'border border-[var(--color-border)]',
  'rounded-lg px-3 py-2 text-xs xs:text-sm sm:px-4 sm:py-2.5',
  'text-[var(--color-foreground)]',
  'outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
  'transition-all duration-200',
  'placeholder:text-[var(--color-foreground-tertiary)]',
  'min-h-[36px] xs:min-h-[40px] sm:min-h-[44px]'
);

export const errorInputStyles =
  'border-[var(--color-error)] focus:ring-[var(--color-error)] bg-[var(--color-error)]/10';
export const successInputStyles = 'border-[var(--color-success)] focus:ring-[var(--color-success)]';

export const labelStyles = 'block text-xs xs:text-sm font-bold text-[var(--color-foreground-secondary)] uppercase mb-1 sm:mb-2';
export const errorMessageStyles = 'text-xs sm:text-sm text-[var(--color-error)] mt-1 flex items-center gap-1';
export const hintStyles = 'text-[10px] xs:text-xs text-[var(--color-foreground-tertiary)] mt-1';

export type ValidationState = 'idle' | 'valid' | 'invalid';

export const getValidationState = (
  error?: FieldError,
  isDirty?: boolean,
  isTouched?: boolean
): ValidationState => {
  if (error) return 'invalid';
  if (isDirty && isTouched && !error) return 'valid';
  return 'idle';
};
