import type { Metadata } from 'next'
import WishlistContent from '@/components/wishlist/WishlistContent'

export const metadata: Metadata = {
  title:       'المفضلة | E-Shop',
  description: 'منتجاتك المفضلة',
}

export default function WishlistPage() {
  return (
    <div className="container-custom py-8">
      <WishlistContent />
    </div>
  )
}