/**
 * Modal design tokens (Tailwind class strings).
 *
 * Phase D: Refactored to use design system tokens with mobile-first responsive design.
 *
 * Goal: keep all modals visually/behaviorally coherent:
 * - consistent overlay (color + blur + padding, responsive)
 * - consistent panel (radius + border + shadow)
 * - consistent viewport caps (no overflow on small screens)
 * - consistent header/body/footer spacing (mobile-first)
 */
export const MODAL_OVERLAY_CLASS =
  // Use a very high z-index so modals never render behind fixed sidebars/overlays.
  // Mobile-first: full width padding on mobile, larger padding on desktop
  // flex items-center center both horizontally and vertically
  'fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(15,23,42,0.6)] backdrop-blur-sm p-2 xs:p-3 sm:p-4';

export const MODAL_PANEL_BASE_CLASS =
  'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl w-full flex flex-col overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl';

// Hard caps to avoid overflow. `dvh` is more stable on mobile browser chrome than `vh`.
export const MODAL_VIEWPORT_CAP_CLASS =
  // UX: default modals should not feel "full screen". Keep room around them.
  // Mobile-first: 85dvh on mobile, 90dvh on tablet+
  'max-h-[calc(85dvh-0.5rem)] xs:max-h-[calc(88dvh-0.75rem)] sm:max-h-[calc(90dvh-1rem)] md:max-h-[calc(90dvh-2rem)]';

export const MODAL_HEADER_CLASS =
  'w-full p-3 xs:p-3.5 sm:p-4 border-b border-[var(--color-border)] flex items-center justify-between shrink-0 gap-2';

export const MODAL_TITLE_CLASS =
  'text-sm xs:text-base sm:text-lg font-bold text-[var(--color-foreground)] font-display';

export const MODAL_CLOSE_BUTTON_CLASS =
  'p-1.5 xs:p-2 hover:bg-[var(--color-background-secondary)] rounded-lg transition-colors focus-visible-ring text-[var(--color-foreground)]';

export const MODAL_BODY_CLASS = 'w-full p-3 xs:p-4 sm:p-5 text-[var(--color-foreground)] text-sm xs:text-base overflow-y-auto flex-1';

export const MODAL_FOOTER_CLASS =
  'w-full p-3 xs:p-4 sm:p-5 border-t border-[var(--color-border)] bg-[var(--color-background-secondary)] shrink-0 flex gap-2 xs:gap-3 sm:gap-4';

