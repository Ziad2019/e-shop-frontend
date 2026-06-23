'use client'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { RecentOrder } from '@/types/dashboard'

interface Props {
  orders:    RecentOrder[]
  isLoading: boolean
}

export default function RecentOrdersTable({ orders, isLoading }: Props) {
  const locale = useLocale()
  const isRTL  = locale === 'ar'

  const getStatus = (order: RecentOrder) => {
    if (order.isDelivered) return { labelAr: 'تم التسليم', labelEn: 'Delivered', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' }
    if (order.isPaid)      return { labelAr: 'مدفوعة',     labelEn: 'Paid',      cls: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' }
    return                        { labelAr: 'قيد الانتظار', labelEn: 'Pending',  cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' }
  }

  return (
    <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text">
          {isRTL ? 'أحدث الطلبات' : 'Recent Orders'}
        </h3>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-xs text-brand hover:text-brand-dark font-medium"
        >
          {isRTL ? 'عرض الكل' : 'View all'}
          {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">
          {isRTL ? 'لا توجد طلبات حتى الآن' : 'No orders yet'}
        </p>
      ) : (
        <div className="space-y-1">
          {orders.map((order) => {
            const status = getStatus(order)
            return (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <span className="text-brand font-bold text-xs">
                      {order.user?.name?.slice(0, 2).toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">{order.user?.name ?? '—'}</p>
                    <p className="text-xs text-text-muted truncate">{order.cartItems?.length ?? 0} {isRTL ? 'منتج' : 'items'}</p>
                  </div>
                </div>
                <div className="text-end shrink-0">
                  <p className="text-sm font-semibold text-text">{order.totalOrderPrice?.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}</p>
                  <Badge className={cn('text-[10px] mt-1 px-2 py-0 font-medium', status.cls)} variant="secondary">
                    {isRTL ? status.labelAr : status.labelEn}
                  </Badge>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}