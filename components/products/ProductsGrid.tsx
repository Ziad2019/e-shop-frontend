'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale } from 'next-intl'
import ProductCard from './ProductCard'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

interface Props {
  products:     Product[]
  currentPage:  number
  totalPages:   number
}

export function ProductsGrid({ products, currentPage, totalPages }: Props) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const locale      = useLocale()

  const goToPage = (page: number) => {
    const p = new URLSearchParams(searchParams.toString())
    p.set('page', page.toString())
    router.push(`${pathname}?${p.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-bold text-text mb-2">
          {locale === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found'}
        </h3>
        <p className="text-text-muted">
          {locale === 'ar' ? 'جرب تغيير الفلاتر' : 'Try changing the filters'}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-stretch">
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1
            const show = page === 1 || page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)

            if (!show) {
              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="text-text-muted">...</span>
              }
              return null
            }

            return (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={cn(
                  'w-10 h-10 rounded-xl text-sm font-semibold transition-all',
                  page === currentPage
                    ? 'bg-brand text-white shadow-lg'
                    : 'border border-[var(--color-border)] text-text-muted hover:bg-bg-secondary'
                )}
              >
                {page}
              </button>
            )
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}