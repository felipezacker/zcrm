/**
 * @deprecated Use UIContext instead. This file re-exports for backward compatibility.
 */
export { useToast, useOptionalToast } from './UIContext';
export type { ToastType, Toast } from './UIContext';

// ToastProvider is no longer needed — UIProvider handles both theme and toasts.
// Re-export UIProvider as ToastProvider for backward compat in layout.tsx
export { UIProvider as ToastProvider } from './UIContext';
