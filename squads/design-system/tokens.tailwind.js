/**
 * ZCRM Design Tokens - Tailwind CSS v4 Configuration
 *
 * Generated: 2026-02-07 by Uma (UX-Design-Expert)
 *
 * This file exports tokens compatible with Tailwind CSS v4's @theme directive.
 * Use this in your tailwind.config.js to keep styles in sync with design tokens.
 *
 * Usage in tailwind.config.js:
 * import tokens from './squads/design-system/tokens.tailwind.js'
 * export default {
 *   theme: {
 *     extend: tokens
 *   }
 * }
 */

export default {
  // Color palette
  colors: {
    // Neutral (Grays)
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },

    // Primary (Blue)
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },

    // Semantic aliases
    background: 'var(--color-background)',
    'background-secondary': 'var(--color-background-secondary)',
    surface: 'var(--color-surface)',
    'surface-hover': 'var(--color-surface-hover)',

    foreground: 'var(--color-foreground)',
    'foreground-secondary': 'var(--color-foreground-secondary)',
    'foreground-tertiary': 'var(--color-foreground-tertiary)',

    divider: 'var(--color-divider)',
    border: 'var(--color-border)',

    // Status colors
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },

  // Spacing scale (4px base)
  spacing: {
    0: '0px',
    xs: 'var(--space-xs)',      // 4px
    sm: 'var(--space-sm)',      // 8px
    md: 'var(--space-md)',      // 16px
    lg: 'var(--space-lg)',      // 24px
    xl: 'var(--space-xl)',      // 32px
    '2xl': 'var(--space-2xl)',  // 48px
    '3xl': 'var(--space-3xl)',  // 64px
  },

  // Typography
  fontFamily: {
    sans: 'var(--font-sans)',
    display: 'var(--font-display)',
    serif: 'var(--font-serif)',
  },

  fontSize: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
    '2xl': 'var(--font-size-2xl)',
    '3xl': 'var(--font-size-3xl)',
    '4xl': 'var(--font-size-4xl)',
  },

  fontWeight: {
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
  },

  lineHeight: {
    tight: 'var(--line-height-tight)',
    normal: 'var(--line-height-normal)',
    relaxed: 'var(--line-height-relaxed)',
  },

  // Border radius
  borderRadius: {
    none: 'var(--border-radius-none)',
    sm: 'var(--border-radius-sm)',
    md: 'var(--border-radius-md)',
    lg: 'var(--border-radius-lg)',
    xl: 'var(--border-radius-xl)',
    full: 'var(--border-radius-full)',
  },

  // Border width
  borderWidth: {
    thin: 'var(--border-width-thin)',
    normal: 'var(--border-width-normal)',
    thick: 'var(--border-width-thick)',
  },

  // Box shadow
  boxShadow: {
    none: 'var(--shadow-none)',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
  },

  // Z-index utilities
  zIndex: {
    dropdown: 'var(--z-dropdown)',
    sticky: 'var(--z-sticky)',
    fixed: 'var(--z-fixed)',
    'modal-backdrop': 'var(--z-modal-backdrop)',
    modal: 'var(--z-modal)',
    tooltip: 'var(--z-tooltip)',
  },

  // Button component sizes
  height: {
    'button-sm': '2rem',      // 32px
    'button-md': '2.5rem',    // 40px
    'button-lg': '3rem',      // 48px
    'input-md': '2.5rem',     // 40px
  },

  // Gap utilities
  gap: {
    xs: 'var(--space-xs)',
    sm: 'var(--space-sm)',
    md: 'var(--space-md)',
    lg: 'var(--space-lg)',
    xl: 'var(--space-xl)',
    '2xl': 'var(--space-2xl)',
    '3xl': 'var(--space-3xl)',
  },

  // Padding utilities
  padding: {
    xs: 'var(--space-xs)',
    sm: 'var(--space-sm)',
    md: 'var(--space-md)',
    lg: 'var(--space-lg)',
    xl: 'var(--space-xl)',
    '2xl': 'var(--space-2xl)',
    '3xl': 'var(--space-3xl)',
  },

  // Margin utilities
  margin: {
    xs: 'var(--space-xs)',
    sm: 'var(--space-sm)',
    md: 'var(--space-md)',
    lg: 'var(--space-lg)',
    xl: 'var(--space-xl)',
    '2xl': 'var(--space-2xl)',
    '3xl': 'var(--space-3xl)',
  },
};

/**
 * MIGRATION GUIDE
 *
 * Old way (hardcoded):
 *   <button className="bg-blue-500 px-4 py-2 rounded-md">
 *
 * New way (token-based):
 *   <button className="bg-primary px-md py-sm rounded-md">
 *
 * Benefits:
 * ✅ Centralized design tokens
 * ✅ Dark mode support via CSS variables
 * ✅ Consistent with brand guidelines
 * ✅ Easy to update globally
 * ✅ Mobile/backend reusable
 *
 * CSS Variables Used:
 * - All colors support CSS custom properties
 * - All spacing values use --space-* variables
 * - All typography uses --font-* variables
 *
 * Dark Mode:
 * - Automatically applied via [data-theme="dark"]
 * - Or prefers-color-scheme: dark
 * - All semantic tokens update automatically
 */
