import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]",
                destructive:
                    "bg-[var(--color-error)] text-white hover:bg-[var(--color-error-dark)]",
                outline:
                    "border border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-background-secondary)]",
                secondary:
                    "bg-[var(--color-neutral-200)] text-[var(--color-foreground)] hover:bg-[var(--color-neutral-300)]",
                ghost: "hover:bg-[var(--color-background-secondary)] text-[var(--color-foreground)]",
                link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
            },
            size: {
                // Mobile-first approach: start small, scale up
                default: "text-xs h-9 px-3 xs:text-sm sm:h-10 sm:px-4 md:h-11 md:px-8 md:text-base",
                sm: "text-xs h-8 px-2 xs:h-9 sm:px-3",
                lg: "text-sm h-11 px-6 sm:h-12 sm:px-8 md:text-base",
                icon: "h-9 w-9 xs:h-10 xs:w-10 md:h-11 md:w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
