'use client'
import Link  from 'next/link'
import { ShoppingBag, } from 'lucide-react'

import { Button } from '@/components/ui/button'
export function EmptyCart({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center mb-6">
        <ShoppingBag size={40} className="text-text-muted" />
      </div>
      <h2 className="text-2xl font-bold text-text mb-2">
        {locale === 'ar' ? 'سلتك فاضية' : 'Your cart is empty'}
      </h2>
      <p className="text-text-muted mb-6">
        {locale === 'ar' ? 'تصفح المنتجات وأضف ما يناسبك' : 'Browse products and add what you like'}
      </p>
      <Button  size="lg" className="bg-brand hover:bg-brand-dark text-white">
        <Link href="/products">
          {locale === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
        </Link>
      </Button>
    </div>
  )
}