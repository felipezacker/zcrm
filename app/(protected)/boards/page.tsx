'use client'

import dynamic from 'next/dynamic'
import { SkeletonPipeline } from '@/components/ui/Skeleton'

const BoardsPage = dynamic(
    () => import('@/features/boards/BoardsPage').then(m => ({ default: m.BoardsPage })),
    { loading: () => <div className="p-6"><SkeletonPipeline /></div>, ssr: false }
)

/**
 * Componente React `Boards`.
 * @returns {Element} Retorna um valor do tipo `Element`.
 */
export default function Boards() {
    return <BoardsPage />
}
