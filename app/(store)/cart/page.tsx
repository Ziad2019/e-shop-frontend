import type { Metadata } from 'next'
import CartContent from '@/components/cart/CartContent'

export const metadata: Metadata = {
  title:       'سلة التسوق | E-Shop',
  description: 'مراجعة منتجات سلة التسوق قبل إتمام الطلب',
}

export default function CartPage() {
  return (
    <div className="container-custom py-8">
      <CartContent />
    </div>
  )
}