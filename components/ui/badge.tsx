import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2 py-0.5 xs:px-2.5 sm:px-3 text-[10px] xs:text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
                secondary:
                    "border-transparent bg-[var(--color-neutral-200)] text-[var(--color-foreground)] hover:bg-[var(--color-neutral-300)]",
                destructive:
                    "border-transparent bg-[var(--color-error)] text-white hover:bg-[var(--color-error-dark)]",
                outline: "text-[var(--color-foreground)] border-[var(--color-border)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

/**
 * Componente React `Badge`.
 *
 * @param {BadgeProps} { className, variant, ...props } - Parâmetro `{ className, variant, ...props }`.
 * @returns {Element} Retorna um valor do tipo `Element`.
 */
function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
