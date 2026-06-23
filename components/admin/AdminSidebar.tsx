'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import {
  LayoutGrid, Package, ShoppingCart, Tags,
  Users, TicketPercent, MessageSquare, BarChart3,
  Settings, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin',            icon: LayoutGrid,     labelAr: 'لوحة التحكم', labelEn: 'Dashboard'  },
  { href: '/admin/products',   icon: Package,        labelAr: 'المنتجات',    labelEn: 'Products'   },
  { href: '/admin/orders',     icon: ShoppingCart,    labelAr: 'الطلبات',     labelEn: 'Orders'     },
  { href: '/admin/categories', icon: Tags,            labelAr: 'التصنيفات',   labelEn: 'Categories' },
  { href: '/admin/users',      icon: Users,           labelAr: 'العملاء',     labelEn: 'Customers'  },
  { href: '/admin/coupons',    icon: TicketPercent,   labelAr: 'الكوبونات',   labelEn: 'Coupons'    },
  { href: '/admin/reviews',    icon: MessageSquare,   labelAr: 'التقييمات',   labelEn: 'Reviews'    },
  { href: '/admin/analytics',  icon: BarChart3,       labelAr: 'التحليلات',   labelEn: 'Analytics'  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const locale   = useLocale()
  const isRTL    = locale === 'ar'

  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <aside
      dir={isRTL ? 'rtl' : 'ltr'}
      className="hidden lg:flex flex-col w-64 h-screen sticky top-0 shrink-0 bg-slate-900 text-slate-300"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-white/10 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center shrink-0">
          <LayoutGrid size={17} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-tight truncate">E-Shop</p>
          <p className="text-xs text-slate-400 leading-tight truncate">
            {isRTL ? 'لوحة التحكم' : 'Admin Dashboard'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                active
                  ? 'bg-brand text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              )}
            >
              <span className="flex items-center gap-3">
                <Icon size={18} className="shrink-0" />
                {isRTL ? item.labelAr : item.labelEn}
              </span>
              {active && <LayoutGrid size={14} className="opacity-0" />}
            </Link>
          )
        })}
      </nav>

      {/* Back to store */}
      <div className="border-t border-white/10 p-3 shrink-0">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          {isRTL ? (
            <>
              {isRTL ? 'العودة للمتجر' : 'Back to store'}
              <ChevronLeft size={16} />
            </>
          ) : (
            <>
              <ChevronRight size={16} />
              {isRTL ? 'العودة للمتجر' : 'Back to store'}
            </>
          )}
        </Link>
      </div>
    </aside>
  )
}