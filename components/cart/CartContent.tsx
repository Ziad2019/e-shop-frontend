'use client'
import { useLocale } from 'next-intl'
import {  ArrowLeft, ArrowRight } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'

import {  useCart, } from '@/hooks/useCarts'
import { EmptyCart } from './EmptyCart'
import { CartItemRow } from './CartItemRow'
import { CartSummary } from './CartSummary'

export default function CartContent() {
  const locale = useLocale()
  const isRTL  = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const { data, isLoading, isError } = useCart()
  const cart        = data?.data
  const cartItems   = cart?.cartItems ?? []
  const isEmpty     = !isLoading && (isError || cartItems.length === 0)
console.log(cartItems)
  if (isLoading) return <CartSkeleton />
  if (isEmpty)    return <EmptyCart locale={locale} />

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-text mb-8">
        {locale === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">

        {/* ── Items List ── */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItemRow key={item._id} item={item} locale={locale} />
          ))}
        </div>

        {/* ── Summary ── */}
        <CartSummary
          totalPrice={cart?.totalCartPrice ?? 0}
          totalAfterDiscount={cart?.totalPriceAfterDiscount}
          locale={locale}
          ArrowIcon={ArrowIcon}
        />
      </div>
    </div>
  )
}

// ============================================================
// SKELETON
// ============================================================
function CartSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </div>
  )
}