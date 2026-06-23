'use client'
import Link  from 'next/link'

import { Tag, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'


import { useApplyCoupon, } from '@/hooks/useCarts'
export function CartSummary({
  totalPrice,
  totalAfterDiscount,
  locale,
  ArrowIcon,
}: {
  totalPrice:          number
  totalAfterDiscount?: number
  locale:              string
  ArrowIcon:           typeof ArrowLeft
}) {
  const [couponCode, setCouponCode] = useState('')
  const { mutate: applyCoupon, isPending } = useApplyCoupon()

  const hasDiscount = totalAfterDiscount !== undefined && totalAfterDiscount < totalPrice
  const finalPrice  = hasDiscount ? totalAfterDiscount! : totalPrice

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return
    applyCoupon({ name: couponCode.trim() })
  }

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      <div className="rounded-2xl border border-[var(--color-border)] bg-bg p-6 space-y-4">
        <h2 className="font-bold text-text text-lg">
          {locale === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
        </h2>

        {/* Coupon */}
        <div>
          <label className="text-sm font-medium text-text mb-2 block">
            {locale === 'ar' ? 'كود الخصم' : 'Coupon Code'}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-text-muted" />
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder={locale === 'ar' ? 'أدخل الكود' : 'Enter code'}
                className="w-full h-10 ps-9 pe-3 rounded-xl border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
              />
            </div>
            <Button
              onClick={handleApplyCoupon}
              disabled={isPending || !couponCode.trim()}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              {locale === 'ar' ? 'تطبيق' : 'Apply'}
            </Button>
          </div>
        </div>

        <div className="h-px bg-[var(--color-border)]" />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-text-muted">
            <span>{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
            <span>{totalPrice.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}</span>
          </div>

          {hasDiscount && (
            <div className="flex justify-between text-sm text-green-600">
              <span>{locale === 'ar' ? 'الخصم' : 'Discount'}</span>
              <span>-{(totalPrice - totalAfterDiscount!).toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}</span>
            </div>
          )}

          <div className="flex justify-between text-sm text-text-muted">
            <span>{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
            <span className="text-green-600">{locale === 'ar' ? 'مجاني' : 'Free'}</span>
          </div>
        </div>

        <div className="h-px bg-[var(--color-border)]" />

        <div className="flex justify-between items-baseline">
          <span className="font-bold text-text">{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
          <span className="text-2xl font-black text-text">
            {finalPrice.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
          </span>
        </div>
      </div>

      <Button
        size="lg"
        
        className="flex  w-full bg-brand hover:bg-brand-dark  gap-2"
      >
        <Link href="/checkout" className='text-white'>
          {locale === 'ar' ? 'إتمام الطلب' : 'Proceed to Checkout'}
          
        </Link>
        <ArrowIcon size={18} />
      </Button>

      <Link
        href="/products"
        className="block text-center text-sm text-text-muted hover:text-brand transition-colors"
      >
        {locale === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
      </Link>
    </div>
  )
}
