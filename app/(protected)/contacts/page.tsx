'use client'

import dynamic from 'next/dynamic'
import { SkeletonList } from '@/components/ui/Skeleton'

const ContactsPage = dynamic(
    () => import('@/features/contacts/ContactsPage').then(m => ({ default: m.ContactsPage })),
    { loading: () => <div className="p-6"><SkeletonList rows={8} /></div>, ssr: false }
)

/**
 * Componente React `Contacts`.
 * @returns {Element} Retorna um valor do tipo `Element`.
 */
export default function Contacts() {
    return <ContactsPage />
}
