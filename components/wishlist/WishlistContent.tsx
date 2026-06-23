'use client'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useWishlist } from '@/hooks/useWishlist'
import { useAuthStore } from '@/store/authStore'
import ProductCard from '@/components/products/ProductCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-bg rounded-2xl overflow-hidden border border-[var(--color-border)]">
          <Skeleton className="aspect-[4/3] sm:aspect-square w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-center pt-1">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function WishlistContent() {
  const locale = useLocale()
  const isAuth = useAuthStore((state) => !!state.accessToken)
  const { data, isLoading, isError } = useWishlist()

  const products = data?.data?.products ?? []
console.log(products)
 
  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center mb-6">
          <Heart size={36} className="text-text-muted" />
        </div>
        <h2 className="text-xl font-bold text-text mb-2">
          {locale === 'ar' ? 'سجل دخولك لمشاهدة المفضلة' : 'Login to view your wishlist'}
        </h2>
        <p className="text-text-muted mb-6">
          {locale === 'ar' ? 'احفظ منتجاتك المفضلة وارجع لها بسهولة' : 'Save your favorite products and come back to them easily'}
        </p>
        <Button  className="bg-brand hover:bg-brand-dark ">
          <Link href="/login" className='text-white'>{locale === 'ar' ? 'تسجيل الدخول' : 'Login'}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text flex items-center gap-3">
          <Heart className="text-red-500 fill-red-500" size={32} />
          {locale === 'ar' ? 'المفضلة' : 'Wishlist'}
        </h1>
        {!isLoading && (
          <p className="text-text-muted mt-2">
            {products.length} {locale === 'ar' ? 'منتج' : 'products'}
          </p>
        )}
      </div>

      {/* Error */}
      {isError && (
        <div className="text-center text-destructive py-12">
          {locale === 'ar' ? 'حدث خطأ في تحميل المفضلة' : 'Failed to load wishlist'}
        </div>
      )}

      {/* Loading */}
      {isLoading && <WishlistSkeleton />}

      {/* Empty */}
      {!isLoading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center mb-6">
            <Heart size={36} className="text-text-muted" />
          </div>
          <h2 className="text-xl font-bold text-text mb-2">
            {locale === 'ar' ? 'المفضلة فاضية' : 'Your wishlist is empty'}
          </h2>
          <p className="text-text-muted mb-6">
            {locale === 'ar' ? 'أضف منتجات تحبها للرجوع لها بسهولة' : 'Add products you love to find them easily later'}
          </p>
          <Button  className="bg-brand hover:bg-brand-dark text-red">
            <Link href="/products" className="text-white">{locale === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}</Link>
          </Button>
        </div>
      )}

      {/* Grid */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}