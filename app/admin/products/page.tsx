import type { Metadata } from 'next'
import AdminProductsContent from '@/components/admin/products/AdminProductsContent'

export const metadata: Metadata = { title: 'إدارة المنتجات | E-Shop' }

export default function AdminProductsPage() {
  return <AdminProductsContent />
}