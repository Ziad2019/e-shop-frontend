'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Search, Bell, LogOut, Menu } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import AdminMobileNavContent from './AdminMobileNavContent'


export default function AdminTopbar() {
  const router = useRouter()
  const locale = useLocale()
  const isRTL  = locale === 'ar'
  const [mobileOpen, setMobileOpen] = useState(false)

  const user      = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      className="sticky top-0 z-40 flex items-center justify-between h-[72px] px-4 lg:px-6 bg-bg border-b border-[var(--color-border)]"
    >
      {/* Mobile menu trigger */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side={isRTL ? 'right' : 'left'} dir={isRTL ? 'rtl' : 'ltr'} className="w-64 p-0 bg-slate-900 border-none">
          <AdminMobileNavContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="hidden sm:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={isRTL ? 'بحث في لوحة التحكم...' : 'Search in dashboard...'}
            className="w-full h-10 ps-10 pe-4 rounded-xl text-sm outline-none border border-[var(--color-border)] bg-bg-secondary text-text focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 ms-auto">

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-bg-secondary transition-colors">
          <Bell size={19} className="text-text-muted" />
          <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-destructive" />
        </button>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 ps-2 pe-1 py-1 rounded-xl hover:bg-bg-secondary transition-colors">
              <div className="text-end hidden sm:block">
                <p className="text-sm font-semibold text-text leading-tight">{user?.name}</p>
                <p className="text-xs text-text-muted leading-tight">{isRTL ? 'مدير' : 'Admin'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <span className="text-brand font-bold text-sm">{user?.name?.slice(0, 1).toUpperCase()}</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? 'start' : 'end'}  className="w-52">
            <div className="px-2 py-1.5">
              <p className="text-sm font-semibold text-text truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer gap-2">
              <LogOut size={15} />
              {isRTL ? 'تسجيل الخروج' : 'Logout'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}