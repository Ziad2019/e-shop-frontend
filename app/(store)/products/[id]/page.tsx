import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'
import ProductDetailClient from '@/components/products/ProductDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
    const json = await res.json()
    const product = json?.data
    if (!product) return {}
    return {
      title:       `${product.title} | E-Shop`,
      description: product.description?.substring(0, 160),
      openGraph: {
        images: product.imageCover?.url ? [product.imageCover.url] : [],
      },
    }
  } catch {
    return {}
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  return <ProductDetailClient id={id} />
}