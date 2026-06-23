import type { Metadata } from 'next'
import CheckoutContent from '@/components/checkout/CheckoutContent'

export const metadata: Metadata = {
  title:       'إتمام الطلب | E-Shop',
  description: 'إتمام عملية الشراء وتأكيد الطلب',
}

export default function CheckoutPage() {
  return (
    <div className="container-custom py-8">
      <CheckoutContent />
    </div>
  )
}