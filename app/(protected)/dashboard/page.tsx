'use client'

import dynamic from 'next/dynamic'
import { SkeletonDashboard } from '@/components/ui/skeleton'

// Dynamic import with contextual skeleton loading
const DashboardPage = dynamic(
    () => import('@/features/dashboard/DashboardPage'),
    {
        loading: () => <div className="p-6"><SkeletonDashboard /></div>,
        ssr: false
    }
)

/**
 * Componente React `Dashboard`.
 * @returns {Element} Retorna um valor do tipo `Element`.
 */
export default function Dashboard() {
    return <DashboardPage />
}
