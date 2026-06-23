'use client'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useTranslations, useLocale } from 'next-intl'

import { ProductsGrid } from './ProductsGrid'
import { ProductFilters } from './productFilters'
import { ProductsSkeleton } from './products-skeleton'
import { ProductsQueryParams } from '@/types/product'


interface Props {
  searchParams: {
    category?: string
    keyword?: string
    sortDir?: string
    page?: string,
    priceMin?: string
    priceMax?: string
    isFeatured?: string 
  }
}

export default function ProductsContent({ searchParams }: Props) {
  const t = useTranslations('products')
  const locale = useLocale()

  const filters = {
    category: searchParams?.category || undefined,
    keyword: searchParams?.keyword || undefined,
    sortDir: (searchParams?.sortDir as 'asc' | 'desc') || undefined,
    page: searchParams?.page ? Number(searchParams.page) : 1,
    limit: 12,
    priceMin: searchParams?.priceMin ? Number(searchParams.priceMin) : undefined,
    priceMax: searchParams?.priceMax ? Number(searchParams.priceMax) : undefined,
    isFeatured: searchParams?.isFeatured === 'true' ? true : undefined,  
  }

  const { data: productsData, isLoading: productsLoading } = useProducts(filters)
  const { data: categoriesData } = useCategories()

  const products = productsData?.data ?? []
  const categories = categoriesData?.data ?? []
  const total = productsData?.total ?? 0
  const totalPages = productsData?.pages ?? 1
  const currentPage = productsData?.page ?? 1

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-text">
          {searchParams.keyword
            ? `${locale === 'ar' ? 'نتائج البحث عن' : 'Search results for'}: "${searchParams.keyword}"`
            : t('title')
          }
        </h1>
        {!productsLoading && (
          <p className="text-text-muted mt-2">
            {total} {locale === 'ar' ? 'منتج' : 'products'}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        {/* Filters Sidebar */}
        <ProductFilters categories={categories} />

        {/* Products */}
        {productsLoading
          ? <ProductsSkeleton />
          : <ProductsGrid
            products={products}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        }
      </div>
    </div>
  )
}