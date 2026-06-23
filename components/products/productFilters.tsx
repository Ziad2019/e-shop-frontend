'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/category'

interface Props {
  categories: Category[]
}


interface FiltersContentProps {
  categories: Category[]
  currentCategory: string
  currentSort: string
  priceRange: { min: string; max: string }
  locale: string
  onApply: (params: Record<string, string | null>) => void
  onClearAll: () => void
  onPriceChange: (key: 'min' | 'max', value: string) => void
}

function FiltersContent({
  categories,
  currentCategory,
  currentSort,
  priceRange,
  locale,
  onApply,
  onClearAll,
  onPriceChange,
}: FiltersContentProps) {
  const hasFilters = currentCategory || priceRange.min || priceRange.max

  const sortOptions = [
    { value: 'asc', label: locale === 'ar' ? 'الاسم أ-ي' : 'Name A-Z' },
    { value: 'desc', label: locale === 'ar' ? 'الاسم ي-أ' : 'Name Z-A' },
  ]

  return (
    <div className="space-y-6">

      {/* Clear All */}
      {hasFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text">
            {locale === 'ar' ? 'الفلاتر النشطة' : 'Active Filters'}
          </span>
          <button onClick={onClearAll} className="text-sm text-destructive hover:opacity-80 font-medium">
            {locale === 'ar' ? 'مسح الكل' : 'Clear All'}
          </button>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="font-bold text-text mb-3">
          {locale === 'ar' ? 'التصنيفات' : 'Categories'}
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onApply({ category: null })}
            className={cn(
              'w-full text-start px-3 py-2.5 rounded-xl text-sm transition-all',
              !currentCategory ? 'bg-brand/10 text-brand font-semibold' : 'text-text-muted hover:bg-bg-secondary'
            )}
          >
            {locale === 'ar' ? 'جميع التصنيفات' : 'All Categories'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onApply({ category: cat._id })}
              className={cn(
                'w-full text-start px-3 py-2.5 rounded-xl text-sm transition-all',
                currentCategory === cat._id ? 'bg-brand/10 text-brand font-semibold' : 'text-text-muted hover:bg-bg-secondary'
              )}
            >
              {typeof cat.name === 'object' ? (cat.name as any)[locale] ?? (cat.name as any).en : cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold text-text mb-3">
          {locale === 'ar' ? 'نطاق السعر' : 'Price Range'}
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder={locale === 'ar' ? 'من' : 'Min'}
            value={priceRange.min}
            onChange={(e) => onPriceChange('min', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
          />
          <span className="text-text-muted">—</span>
          <input
            type="number"
            placeholder={locale === 'ar' ? 'إلى' : 'Max'}
            value={priceRange.max}
            onChange={(e) => onPriceChange('max', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
          />
        </div>
        <Button
          onClick={() => onApply({ priceMin: priceRange.min || null, priceMax: priceRange.max || null })}
          size="sm"
          variant="outline"
          className="w-full mt-3"
        >
          {locale === 'ar' ? 'تطبيق السعر' : 'Apply Price'}
        </Button>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-bold text-text mb-3">
          {locale === 'ar' ? 'ترتيب حسب' : 'Sort By'}
        </h3>
        <div className="space-y-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onApply({ sortDir: opt.value })}
              className={cn(
                'w-full text-start px-3 py-2.5 rounded-xl text-sm transition-all',
                currentSort === opt.value ? 'bg-brand/10 text-brand font-semibold' : 'text-text-muted hover:bg-bg-secondary'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────
export function ProductFilters({ categories }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('priceMin') ?? '',
    max: searchParams.get('priceMax') ?? '',
  })

  const currentCategory = searchParams.get('category') ?? ''
  const currentSort = searchParams.get('sortDir') ?? 'asc'

  const createQuery = useCallback(
    (params: Record<string, string | null>) => {
      const p = new URLSearchParams(searchParams.toString())
      Object.entries(params).forEach(([k, v]) => {
        if (!v) p.delete(k)
        else p.set(k, v)
      })
      if (!params.page) p.delete('page')
      return p.toString()
    },
    [searchParams]
  )

  const apply = (params: Record<string, string | null>) => {
    router.push(`${pathname}?${createQuery(params)}`, { scroll: false })
  }

  const clearAll = () => {
    router.push(pathname)
    setPriceRange({ min: '', max: '' })
  }

  const handlePriceChange = (key: 'min' | 'max', value: string) => {
    setPriceRange(p => ({ ...p, [key]: value }))
  }

  const sharedProps = {
    categories,
    currentCategory,
    currentSort,
    priceRange,
    locale,
    onApply: apply,
    onClearAll: clearAll,
    onPriceChange: handlePriceChange,
  }

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 bg-bg rounded-2xl border border-[var(--color-border)] p-6">
          <h2 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5" />
            {locale === 'ar' ? 'الفلاتر' : 'Filters'}
          </h2>
          <FiltersContent {...sharedProps} />
        </div>
      </aside>

      {/* Mobile Button */}
      <div className=" lg:hidden fixed bottom-6 end-6 z-999">
        <Button
          onClick={() => setMobileOpen(true)}
          className="rounded-full shadow-2xl bg-brand hover:bg-brand-dark text-white gap-2"
          size="lg"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {locale === 'ar' ? 'الفلاتر' : 'Filters'}
        </Button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed bottom-0 start-0 end-0 bg-bg rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text">
                  {locale === 'ar' ? 'الفلاتر' : 'Filters'}
                </h2>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-bg-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FiltersContent {...sharedProps} />
              <Button
                onClick={() => setMobileOpen(false)}
                className="w-full mt-6 bg-brand hover:bg-brand-dark text-white"
                size="lg"
              >
                {locale === 'ar' ? 'عرض النتائج' : 'Show Results'}
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}