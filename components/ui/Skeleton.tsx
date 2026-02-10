import { cn } from '@/lib/utils/cn'

/**
 * Base Skeleton component with pulse animation.
 * Dark-mode compatible. Use for any loading placeholder.
 *
 * @example
 * <Skeleton className="h-4 w-[200px]" />
 */
export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                'animate-pulse rounded-md bg-slate-700/30',
                className
            )}
        />
    )
}

/**
 * Skeleton for a card layout (e.g., dashboard stats).
 */
export function SkeletonCard({ className }: { className?: string }) {
    return (
        <div className={cn('rounded-xl border border-dark-border bg-dark-card p-6', className)}>
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
        </div>
    )
}

/**
 * Skeleton for list rows (e.g., contacts, deals table).
 */
export function SkeletonList({
    rows = 5,
    className,
}: {
    rows?: number
    className?: string
}) {
    return (
        <div className={cn('space-y-3', className)}>
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-lg border border-dark-border bg-dark-card"
                >
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/5" />
                        <Skeleton className="h-3 w-2/5" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                </div>
            ))}
        </div>
    )
}

/**
 * Skeleton for table layout.
 */
export function SkeletonTable({
    rows = 5,
    cols = 4,
    className,
}: {
    rows?: number
    cols?: number
    className?: string
}) {
    return (
        <div className={cn('rounded-xl border border-dark-border bg-dark-card overflow-hidden', className)}>
            {/* Header */}
            <div className="flex gap-4 p-4 border-b border-dark-border">
                {Array.from({ length: cols }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="flex gap-4 p-4 border-b border-dark-border last:border-b-0"
                >
                    {Array.from({ length: cols }).map((_, j) => (
                        <Skeleton key={j} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    )
}

/**
 * Skeleton for kanban pipeline column.
 */
export function SkeletonPipeline({
    columns = 4,
    cardsPerColumn = 3,
    className,
}: {
    columns?: number
    cardsPerColumn?: number
    className?: string
}) {
    return (
        <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
            {Array.from({ length: columns }).map((_, i) => (
                <div
                    key={i}
                    className="flex-shrink-0 w-72 rounded-xl border border-dark-border bg-dark-card"
                >
                    {/* Column header */}
                    <div className="p-4 border-b border-dark-border">
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    {/* Cards */}
                    <div className="p-3 space-y-3">
                        {Array.from({ length: cardsPerColumn }).map((_, j) => (
                            <div
                                key={j}
                                className="rounded-lg border border-dark-border bg-dark-bg p-3 space-y-2"
                            >
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                                <div className="flex justify-between items-center pt-1">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-6 w-6 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

/**
 * Skeleton for dashboard cards grid.
 */
export function SkeletonDashboard({ className }: { className?: string }) {
    return (
        <div className={cn('space-y-6', className)}>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
            {/* Chart area */}
            <div className="rounded-xl border border-dark-border bg-dark-card p-6">
                <Skeleton className="h-5 w-32 mb-4" />
                <Skeleton className="h-48 w-full rounded-lg" />
            </div>
            {/* Table */}
            <SkeletonTable rows={5} cols={5} />
        </div>
    )
}
