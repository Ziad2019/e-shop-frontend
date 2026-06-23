'use client'
import Link  from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useState } from 'react'
import {
  Package, ChevronDown, ChevronUp, Truck,
  CheckCircle2, Clock, Banknote, CreditCard, ShoppingBag,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { Order, OrderItemProduct } from '@/types/order'
import { useMyOrders } from '@/hooks/useOrders'


export default function MyOrdersContent() {
  const locale = useLocale()
  const { data, isLoading, isError } = useMyOrders()

  const orders = data?.data ?? []
  const isEmpty = !isLoading && (isError || orders.length === 0)

  if (isLoading) return <OrdersSkeleton />
  if (isEmpty)    return <EmptyOrders locale={locale} />

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
        {locale === 'ar' ? 'طلباتي' : 'My Orders'}
      </h1>
      <p className="text-text-muted mb-8">
        {orders.length} {locale === 'ar' ? 'طلب' : 'orders'}
      </p>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} locale={locale} />
        ))}
      </div>
    </div>
  )
}

// ============================================================
// ORDER CARD
// ============================================================
function OrderCard({ order, locale }: { order: Order; locale: string }) {
  const [expanded, setExpanded] = useState(false)

  const orderDate = new Date(order.createdAt).toLocaleDateString(
    locale === 'ar' ? 'ar-EG' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

  const statusInfo = getStatusInfo(order, locale)

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-bg overflow-hidden">

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-4 p-5 hover:bg-bg-secondary/50 transition-colors text-start"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={cn(
            'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
            statusInfo.bgClass
          )}>
            <statusInfo.icon size={18} className={statusInfo.iconClass} />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-text text-sm">
              {locale === 'ar' ? 'طلب' : 'Order'} #{order._id.slice(-6).toUpperCase()}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{orderDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Badge className={cn('text-xs', statusInfo.badgeClass)}>
            {statusInfo.label}
          </Badge>
          <span className="font-bold text-text hidden sm:block">
            {order.totalOrderPrice.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
          </span>
          {expanded ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-[var(--color-border)] p-5 space-y-5">

          {/* Items */}
          <div className="space-y-3">
            {order.cartItems.map((item) => {
              const product = typeof item.product === 'object'
                ? (item.product as OrderItemProduct)
                : null
              return (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-bg-secondary flex items-center justify-center shrink-0 text-lg">
                    🛍️
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text line-clamp-1">{product?.title ?? '...'}</p>
                    {item.color && (
                      <p className="text-xs text-text-muted">
                        {locale === 'ar' ? 'اللون' : 'Color'}: {item.color}
                      </p>
                    )}
                    <p className="text-xs text-text-muted">
                      {item.quantity} × {item.price.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-text shrink-0">
                    {(item.price * item.quantity).toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="h-px bg-[var(--color-border)]" />

          {/* Shipping + Payment Info */}
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-muted text-xs mb-1">
                {locale === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
              </p>
              <p className="text-text">
                {order.shippingAddress?.details}
                {order.shippingAddress?.city && `, ${order.shippingAddress.city}`}
              </p>
              {order.shippingAddress?.phone && (
                <p className="text-text-muted text-xs mt-0.5">{order.shippingAddress.phone}</p>
              )}
            </div>
            <div>
              <p className="text-text-muted text-xs mb-1">
                {locale === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
              </p>
              <div className="flex items-center gap-1.5 text-text">
                {order.paymentMethodType === 'cash' ? <Banknote size={14} /> : <CreditCard size={14} />}
                <span>
                  {order.paymentMethodType === 'cash'
                    ? (locale === 'ar' ? 'دفع عند الاستلام' : 'Cash on Delivery')
                    : (locale === 'ar' ? 'بطاقة ائتمانية' : 'Credit Card')}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-[var(--color-border)]" />

          {/* Price Breakdown */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
              <span>{order.shippingPrice === 0 ? (locale === 'ar' ? 'مجاني' : 'Free') : order.shippingPrice}</span>
            </div>
            <div className="flex justify-between font-bold text-text pt-1">
              <span>{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
              <span>{order.totalOrderPrice.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// STATUS HELPER
// ============================================================
function getStatusInfo(order: Order, locale: string) {
  if (order.isDelivered) {
    return {
      label:      locale === 'ar' ? 'تم التوصيل' : 'Delivered',
      icon:       CheckCircle2,
      bgClass:    'bg-green-100 dark:bg-green-900/30',
      iconClass:  'text-green-600',
      badgeClass: 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
    }
  }
  if (order.isPaid) {
    return {
      label:      locale === 'ar' ? 'قيد الشحن' : 'Shipping',
      icon:       Truck,
      bgClass:    'bg-blue-100 dark:bg-blue-900/30',
      iconClass:  'text-blue-600',
      badgeClass: 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
    }
  }
  return {
    label:      locale === 'ar' ? 'قيد المعالجة' : 'Processing',
    icon:       Clock,
    bgClass:    'bg-amber-100 dark:bg-amber-900/30',
    iconClass:  'text-amber-600',
    badgeClass: 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
  }
}

// ============================================================
// EMPTY STATE
// ============================================================
function EmptyOrders({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center mb-6">
        <Package size={40} className="text-text-muted" />
      </div>
      <h2 className="text-2xl font-bold text-text mb-2">
        {locale === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
      </h2>
      <p className="text-text-muted mb-6">
        {locale === 'ar' ? 'ابدأ التسوق وستظهر طلباتك هنا' : 'Start shopping and your orders will appear here'}
      </p>
      <Button  size="lg" className="bg-brand hover:bg-brand-dark text-white">
        <Link href="/products" className='text-white'>
          {locale === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
        </Link>
      </Button>
    </div>
  )
}

// ============================================================
// SKELETON
// ============================================================
function OrdersSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-40 mb-2" />
      <Skeleton className="h-5 w-24 mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}