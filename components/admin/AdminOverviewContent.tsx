'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { Package, Users, ShoppingCart, DollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import StatCard from './StatCard'
import { useDashboardOverview, useDashboardRecentOrders } from '@/hooks/useDashboard'

export default function AdminOverviewContent() {
  const locale = useLocale()
  const isRTL  = locale === 'ar'

  const { data: overviewRes, isLoading: ovLoading } = useDashboardOverview()
  const { data: recentOrdersRes, isLoading: roLoading } = useDashboardRecentOrders(5)

  const overview = overviewRes?.data
  const orders   = recentOrdersRes?.data ?? []
  const lowStock = overview?.lowStockProducts ?? 0

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>

      <div>
        <h1 className="text-2xl font-bold text-text">{isRTL ? 'لوحة التحكم' : 'Dashboard'}</h1>
        <p className="text-text-muted text-sm mt-1">
          {isRTL ? 'نظرة عامة على أداء المتجر' : 'A general overview of store performance'}
        </p>
      </div>

      {ovLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label={isRTL ? 'المنتجات النشطة' : 'Active Products'}
            value={overview?.totalProducts ?? 0}
            icon={Package}
            trend={{ value: 2.3, isUp: true }}
            iconBg="bg-orange-100 dark:bg-orange-950"
            iconColor="text-orange-600 dark:text-orange-400"
          />
          <StatCard
            label={isRTL ? 'العملاء' : 'Customers'}
            value={overview?.totalUsers ?? 0}
            icon={Users}
            trend={{ value: 5.1, isUp: true }}
            iconBg="bg-purple-100 dark:bg-purple-950"
            iconColor="text-purple-600 dark:text-purple-400"
          />
          <StatCard
            label={isRTL ? 'إجمالي الطلبات' : 'Total Orders'}
            value={overview?.totalOrders ?? 0}
            icon={ShoppingCart}
            trend={{ value: 8.2, isUp: true }}
            iconBg="bg-blue-100 dark:bg-blue-950"
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            label={isRTL ? 'إجمالي الإيرادات' : 'Total Revenue'}
            value={`$${(overview?.totalRevenue ?? 0).toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: 12.5, isUp: true }}
            iconBg="bg-emerald-100 dark:bg-emerald-950"
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">

        {/* Low Stock */}
        <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text flex items-center gap-2">
              <AlertTriangle size={17} className="text-amber-500" />
              {isRTL ? 'مخزون منخفض' : 'Low Stock'}
            </h3>
            <Link href="/admin/products" className="text-xs text-brand hover:text-brand-dark font-medium">
              {isRTL ? 'عرض الكل' : 'View all'}
            </Link>
          </div>
          {ovLoading ? (
            <Skeleton className="h-16 rounded-xl" />
          ) : lowStock === 0 ? (
            <div className="flex items-center gap-2 py-6 justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">{isRTL ? 'المخزون ممتاز' : 'Stock is healthy'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 py-6 justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle size={18} />
              <span className="text-sm font-medium">
                {lowStock} {isRTL ? 'منتج يحتاج إعادة تخزين' : 'products need restocking'}
              </span>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text">{isRTL ? 'أحدث الطلبات' : 'Recent Orders'}</h3>
            <Link href="/admin/orders" className="text-xs text-brand hover:text-brand-dark font-medium">
              {isRTL ? 'عرض الكل' : 'View all'}
            </Link>
          </div>
          {roLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">
              {isRTL ? 'لا توجد طلبات بعد' : 'No orders yet'}
            </p>
          ) : (
            <div className="space-y-1">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/admin/orders/${order._id}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-bg-secondary transition-colors"
                >
                  <span className="text-sm font-medium text-text">{order.user?.name}</span>
                  <span className="text-sm font-semibold text-text">{order.totalOrderPrice?.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}