import ProductsContent from '@/components/products/ProductsContent'
import { ProductsSkeleton } from '@/components/products/products-skeleton'
import type { Metadata } from 'next'
import { Suspense } from 'react'


export const metadata: Metadata = {
  title: 'المنتجات | E-Shop',
  description: 'تصفح جميع المنتجات',
}

interface Props {
  searchParams: Promise<{
    category?: string
    keyword?: string
    sortDir?: string
    page?: string
    priceMin?: string
    priceMax?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams
  console.log(params)
  return (
    <div className="container-custom py-8">
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent searchParams={params} />
      </Suspense>
    </div>
  )
}