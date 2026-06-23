'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useFeaturedProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/products/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/types/product'

// ── Loading Skeleton ──────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="bg-bg rounded-2xl overflow-hidden border border-[var(--color-border)]">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function FeaturedProducts() {
  const { data, isLoading, isError } = useFeaturedProducts()
  const t      = useTranslations('products')
  const locale = useLocale()
  const isRTL  = locale === 'ar'

  const products: Product[] = data?.data ?? []

  return (
    <section className="py-16 bg-bg">
      <div className="container-custom">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-text">
              {t('featured')}
            </h2>
            <div className="w-55 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-3" />
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-brand hover:text-brand-dark font-medium transition-colors text-sm"
          >
            {t('viewAll')}
            {isRTL
              ? <ArrowLeft size={16} />
              : <ArrowRight size={16} />
            }
          </Link>
        </div>

        {/* Error */}
        {isError && (
          <div className="text-center text-destructive py-12">
            {t('error')}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))
          }
        </div>

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="text-lg font-medium">{t('noProducts')}</p>
          </div>
        )}

      </div>
    </section>
  )
}