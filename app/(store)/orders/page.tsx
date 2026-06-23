import type { Metadata } from 'next'
import MyOrdersContent from '@/components/orders/MyOrdersContent'

export const metadata: Metadata = {
  title:       'طلباتي | E-Shop',
  description: 'استعراض جميع طلباتك السابقة وحالتها',
}

export default function OrdersPage() {
  return (
    <div className="container-custom py-8">
      <MyOrdersContent />
    </div>
  )
}