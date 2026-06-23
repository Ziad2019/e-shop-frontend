'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Menu, LogOut, ShieldCheck } from 'lucide-react'
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Tags, Award, TicketPercent, Star,
} from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  { href: '/admin',            icon: LayoutDashboard, labelAr: 'الرئيسية',     labelEn: 'Overview'   },
  { href: '/admin/products',   icon: Package,         labelAr: 'المنتجات',     labelEn: 'Products'   },
  { href: '/admin/orders',     icon: ShoppingCart,     labelAr: 'الطلبات',      labelEn: 'Orders'     },
  { href: '/admin/users',      icon: Users,            labelAr: 'المستخدمين',   labelEn: 'Users'      },
  { href: '/admin/categories', icon: Tags,             labelAr: 'الفئات',       labelEn: 'Categories' },
  { href: '/admin/brands',     icon: Award,            labelAr: 'الماركات',     labelEn: 'Brands'     },
  { href: '/admin/coupons',    icon: TicketPercent,    labelAr: 'الكوبونات',    labelEn: 'Coupons'    },
  { href: '/admin/reviews',    icon: Star,             labelAr: 'التقييمات',    labelEn: 'Reviews'    },
]

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()
  const locale   = useLocale()
  const isRTL    = locale === 'ar'
  const user      = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-bg border-b border-[var(--color-border)]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
          <ShieldCheck size={15} className="text-white" />
        </div>
        <span className="text-sm font-bold text-text">
          {isRTL ? 'لوحة التحكم' : 'Admin Panel'}
        </span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side={isRTL ? 'right' : 'left'} dir={isRTL ? 'rtl' : 'ltr'} className="w-72 bg-bg p-0 flex flex-col">
          <div className="px-4 py-4 border-b border-[var(--color-border)] shrink-0">
            <SheetHeader>
              <SheetTitle className="text-start text-base">
                {isRTL ? 'لوحة التحكم' : 'Admin Panel'}
              </SheetTitle>
            </SheetHeader>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    active ? 'bg-brand/10 text-brand' : 'text-text-muted hover:bg-bg-secondary'
                  )}
                >
                  <Icon size={18} />
                  <span>{isRTL ? item.labelAr : item.labelEn}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-[var(--color-border)] p-3 shrink-0">
            <div className="flex items-center gap-3 px-2 py-2 mb-1">
              <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <span className="text-brand font-bold text-sm">{user?.name?.slice(0, 1).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text truncate">{user?.name}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => { handleLogout(); setOpen(false) }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-destructive hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
            >
              <LogOut size={18} />
              {isRTL ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}