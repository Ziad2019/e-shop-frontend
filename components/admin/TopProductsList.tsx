'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { ArrowRight, ArrowLeft, Star } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { TopProduct } from '@/types/dashboard'

interface Props {
  products:  TopProduct[]
  isLoading: boolean
}

export default function TopProductsList({ products, isLoading }: Props) {
  const locale = useLocale()
  const isRTL  = locale === 'ar'

  return (
    <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text">
          {isRTL ? 'الأكثر مبيعاً' : 'Top Selling Products'}
        </h3>
        <Link
          href="/admin/products"
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
      ) : products.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">
          {isRTL ? 'لا توجد بيانات' : 'No data available'}
        </p>
      ) : (
        <div className="space-y-1">
          {products.map((product, index) => (
            <Link
              key={product._id}
              href={`/admin/products/${product._id}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-secondary transition-colors"
            >
              <span className="text-xs font-bold text-text-muted w-5 shrink-0">{index + 1}</span>
              <div className="relative w-10 h-10 rounded-lg bg-bg-secondary overflow-hidden shrink-0">
                {product.imageCover?.url ? (
                  <Image src={product.imageCover.url} alt={product.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text truncate">{product.title}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={11} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-text-muted">{product.ratingsAverage?.toFixed(1) ?? '0.0'}</span>
                  <span className="text-xs text-text-muted">· {product.sold} {isRTL ? 'مباع' : 'sold'}</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-text shrink-0">
                {product.price?.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}