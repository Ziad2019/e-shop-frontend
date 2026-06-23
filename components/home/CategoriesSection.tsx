'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCategories } from '@/hooks/useCategories'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'
import {
  Smartphone, Shirt, Home, Sparkles, Volleyball,
  BookOpen, Gamepad2, UtensilsCrossed, Package,
} from 'lucide-react'

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  electronics: Smartphone,
  fashion:     Shirt,
  home:        Home,
  beauty:      Sparkles,
  sports:      Volleyball,
  books:       BookOpen,
  toys:        Gamepad2,
  food:        UtensilsCrossed,
}

function CategorySkeleton() {
  return (
    <div className="bg-bg rounded-2xl p-5 border border-[var(--color-border)] flex flex-col items-center gap-3">
      <Skeleton className="w-14 h-14 rounded-full" />
      <Skeleton className="h-3.5 w-16" />
    </div>
  )
}

export default function CategoriesSection() {
  const { data, isLoading, isError } = useCategories()
  const t = useTranslations('categories')

  const categories = data?.data ?? []

  return (
    <section className="py-16 bg-bg-secondary">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-text">
            {t('title')}
          </h2>
          <p className="text-text-muted mt-3">
            {t('subtitle')}
          </p>
        </div>

        {/* Error */}
        {isError && (
          <div className="text-center text-destructive py-8">
            {t('error')}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-3">

          {/* Loading */}
          {isLoading && Array.from({ length: 6 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}

          {/* Data */}
          {!isLoading && categories.map((category) => {
            const Icon = categoryIcons[category.slug] ?? Package

            return (
              <Link
                key={category._id}
                href={`/products?category=${category._id}`}
                className={`
                  group relative
                  bg-bg rounded-2xl p-5
                  border border-[var(--color-border)]
                  flex flex-col items-center gap-3
                  transition-all duration-200
                  hover:border-brand hover:-translate-y-0.5
                  hover:shadow-md
                `}
              >
                {/* Icon / Image */}
                {category.image?.url ? (
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-1 ring-[var(--color-border)] group-hover:ring-brand transition-all">
                    <Image
                      src={category.image.url}
                      alt={category.name}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className={`
                    w-14 h-14 rounded-full
                    bg-brand/10 group-hover:bg-brand
                    flex items-center justify-center
                    transition-colors duration-200
                  `}>
                    <Icon
                      size={22}
                      className="text-brand group-hover:text-white transition-colors duration-200"
                    />
                  </div>
                )}

                {/* Name */}
                <h3 className="text-sm font-semibold text-text group-hover:text-brand transition-colors text-center line-clamp-1">
                  {category.name}
                </h3>
              </Link>
            )
          })}

        </div>

        {/* Empty State */}
        {!isLoading && !isError && categories.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            <p>{t('error')}</p>
          </div>
        )}

      </div>
    </section>
  )
}