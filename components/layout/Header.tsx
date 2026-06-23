'use client'
import Link from 'next/link'
import { Heart, Search, ShoppingBag, Sun, Moon, Menu, User, LogOut, Package, Settings, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  NavigationMenu, NavigationMenuList,
  NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent,
} from '@/components/ui/navigation-menu'
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ListItem } from '@/components/ItemList'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useAuthStore } from '@/store/authStore'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCarts'
import { useCartDrawer } from '../cart/CartDrawerContext'
import { useCategories } from '@/hooks/useCategories'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [search, setSearch] = useState('')

  const t = useTranslations('nav')
  const tCat = useTranslations('categories')
  const tAuth = useTranslations('auth')

  const locale = useLocale()
  const isDark = theme === 'dark'
  const isRTL = locale === 'ar'
  const { data: cartData } = useCart()
  const cartCount = cartData?.numOfCartItems ?? 0
  const { toggle: toggleCartDrawer } = useCartDrawer()

  const { data: wishlistData } = useWishlist()
  const wishlistCount = wishlistData?.data?.products?.length ?? 0

  const { data: categoriesData } = useCategories()
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  useEffect(() => setMounted(true), [])
console.log(user?.avatar)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim()) return
    router.push(`/products?keyword=${encodeURIComponent(search.trim())}`)
  }
  const handleLogout = () => {
    clearAuth()
    router.push('/')
    toast.success(isRTL ? 'تم تسجيل الخروج' : 'Logged out successfully')
  }

  const categoryIcons: Record<string, string> = {
    electronics: '📱',
    fashion: '👕',
    home: '🏠',
    beauty: '💄',
    sports: '⚽',
  }

  const categories = (categoriesData?.data ?? []).map(cat => ({
    href: `/products?category=${cat._id}`,
    icon: categoryIcons[cat.slug] ?? '🛍️',
    label: cat.name,
  }))

  const navLinks = [
    { label: t('home'), href: '/' },
    { label: t('products'), href: '/products' },
    { label: t('deals'), href: '/products?isFeatured=true' },
  ]

  return (
    <>
      {/* ── Promo Bar ── */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm">
        {t('promo')}
      </div>

      {/* ── Main Header ── */}
      <header
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          'font-sans',
          'sticky top-0 z-50 transition-all duration-300',
          'border-b border-[var(--color-border)]',
          isScrolled ? 'bg-bg/90 backdrop-blur-lg shadow-lg' : 'bg-bg'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text hidden sm:block">E-Shop</span>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-colors ',
                    'text-text-muted hover:text-brand hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-text-muted hover:text-brand bg-transparent">
                      {t('categories')}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent  dir={isRTL ? 'rtl' : 'ltr'}>
                      <ul className="w-52 flex flex-col gap-1 p-2">
                        {categories.map((cat) => (
                          <ListItem key={cat.href} href={cat.href} icon={cat.icon}>
                            {cat.label}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            {/* ── Search Bar ── */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className={cn(
                  'absolute top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted',
                  isRTL ? 'right-3' : 'left-3'
                )} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('search')}
                  className={cn(
                    'w-full h-10 rounded-xl text-sm outline-none',
                    'border border-[var(--color-border)]',
                    'bg-bg-secondary text-text',
                    'focus:bg-bg focus:border-brand focus:ring-2 focus:ring-brand/20',
                    'transition-all placeholder:text-text-muted',
                    isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  )}
                />
              </div>
            </form>

            {/* ── Actions ── */}
            <div className="flex items-center gap-1">

              {/* Language */}
              <LanguageSwitcher currentLocale={locale} />

              {/* Dark Mode */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  aria-label={isRTL ? 'تغيير المظهر' : 'Toggle theme'}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={isRTL ? 'المفضلة' : 'Wishlist'}
              >
                <Heart className="w-5 h-5 text-text-muted" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              {/* Cart */}
              <button
                onClick={toggleCartDrawer}
                aria-label={t('cart')}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ShoppingBag size={18} className="text-text-muted" />
                {cartCount > 0 && (
                  <span className={cn(
                    'absolute -top-1 -right-1',
                    'w-4 h-4 rounded-full',
                    'bg-brand text-white',
                    'text-[10px] font-bold',
                    'flex items-center justify-center'
                  )}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'flex items-center gap-2 rounded-full',
                        'px-2 py-1.5 transition-colors',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                      )}
                    >

                      <Avatar className="w-8 h-8 shrink-0">
                        {user.avatar ? (
                          <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                        ) : (
                          <AvatarFallback className="bg-brand/10 text-brand">
                            <User size={15} />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="hidden sm:block text-sm font-medium text-text max-w-[90px] truncate">
                        {user.name?.split(' ')[0]}
                      </span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align={isRTL ? 'start' : 'end'}
                   
                    className="w-56 p-3"
                  >

                    <div className="text-center mb-2">
                      <p className="font-semibold text-sm text-text truncate">{user.name}</p>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </div>

                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuItem asChild className="rounded-md py-2 gap-2 cursor-pointer">
                      <Link href="/profile">
                        <User size={15} className="text-text-muted" />
                        <span className="text-sm text-text-muted">{t('profile')}</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="rounded-md py-2 gap-2 cursor-pointer">
                      <Link href="/orders">
                        <Package size={15} className="text-text-muted" />
                        <span className="text-sm text-text-muted">{t('orders')}</span>
                      </Link>
                    </DropdownMenuItem>

                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild className="rounded-md py-2 gap-2 cursor-pointer">
                        <Link href="/admin" className="text-brand">
                          <ShieldCheck size={15} />
                          <span className="text-sm font-medium">Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuItem
                      className="rounded-md py-2 gap-2 text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut size={15} />
                      <span className="text-sm">{t('logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                      'text-text-muted hover:text-brand hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    {tAuth('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-brand hover:bg-brand-dark transition-colors"
                  >
                    {tAuth('register')}
                  </Link>
                </div>
              )}
              {/* Mobile Menu */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu size={18} />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={isRTL ? 'right' : 'left'}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="w-72 bg-bg flex flex-col overflow-hidden p-0"
                >
                  {/* Header */}
                  <div className="sticky top-0 bg-bg border-b border-[var(--color-border)] px-4 py-4 shrink-0">
                    <SheetHeader>
                      <SheetTitle>
                        <Link
                          href="/"
                          className="flex items-center gap-2"
                          onClick={() => setSheetOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-white" />
                          </div>
                          <span className="gradient-text text-xl font-bold">E-Shop</span>
                        </Link>
                      </SheetTitle>
                    </SheetHeader>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-4 space-y-4">

                      {/* Search */}
                      <form onSubmit={handleSearch} className="relative">
                        <Search className={cn(
                          'absolute top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted',
                          isRTL ? 'right-3' : 'left-3'
                        )} />
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder={t('search')}
                          className={cn(
                            'w-full h-10 rounded-xl text-sm outline-none',
                            'border border-[var(--color-border)]',
                            'bg-bg-secondary text-text',
                            'focus:border-brand focus:ring-2 focus:ring-brand/20',
                            'transition-all placeholder:text-text-muted',
                            isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
                          )}
                        />
                      </form>

                      <Separator />

                      {/* Nav Links */}
                      <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setSheetOpen(false)}
                            className={cn(
                              'px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                              'text-text-muted hover:text-brand hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </nav>

                      <Separator />

                      {/* Categories */}
                      <div>
                        <p className="text-xs text-text-muted font-medium mb-2 uppercase tracking-wider px-3">
                          {t('categories')}
                        </p>
                        <div className="flex flex-col gap-1">
                          {categories.map((cat) => (
                            <Link
                              key={cat.href}
                              href={cat.href}
                              onClick={() => setSheetOpen(false)}
                              className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                                'text-text-muted hover:text-brand hover:bg-gray-100 dark:hover:bg-gray-800'
                              )}
                            >
                              <span>{cat.icon}</span>
                              <span>{cat.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-bg border-t border-[var(--color-border)] px-4 py-4 shrink-0">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[var(--color-border)]">
                          <Avatar className="w-9 h-9">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-brand text-white text-xs">
                              {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-text-muted">{user.email}</p>
                          </div>
                        </div>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            onClick={() => setSheetOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <ShieldCheck size={15} />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={() => { handleLogout(); setSheetOpen(false) }}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors',
                            'text-destructive hover:bg-red-50 dark:hover:bg-red-950'
                          )}
                        >
                          <LogOut size={15} />
                          {t('logout')}
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/login"
                          onClick={() => setSheetOpen(false)}
                          className="w-full text-center py-2.5 rounded-xl text-sm font-medium border border-[var(--color-border)] text-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          {tAuth('login')}
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setSheetOpen(false)}
                          className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-white bg-brand hover:bg-brand-dark transition-colors"
                        >
                          {tAuth('register')}
                        </Link>
                      </div>
                    )}
                  </div>

                </SheetContent>
              </Sheet>

            </div>
          </div>
        </div>
      </header>
    </>
  )
}