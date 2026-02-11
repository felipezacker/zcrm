import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

const buttonVariants = {
  primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-lg shadow-[var(--color-primary)]/20',
  secondary: 'bg-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-700)] shadow-lg shadow-[var(--color-neutral-600)]/20',
  danger: 'bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] shadow-lg shadow-[var(--color-error)]/20',
};

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
