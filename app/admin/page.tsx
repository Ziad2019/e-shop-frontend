import type { Metadata } from 'next'
import AdminOverviewContent from '@/components/admin/AdminOverviewContent'

export const metadata: Metadata = {
  title: 'لوحة التحكم | E-Shop',
}

export default function AdminOverviewPage() {
  return <AdminOverviewContent />
}