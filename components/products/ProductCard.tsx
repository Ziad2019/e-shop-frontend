'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'
import WishlistButton from './WishlistButton'
import { useAddToCart } from '@/hooks/useCarts'
import { useCartDrawer } from '../cart/CartDrawerContext'
import AddCartButton from './AddCartButton'

interface ProductCardProps {
  product: Product
  index?: number   // animation delay
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {

  const [imageError, setImageError] = useState(false)
  const t = useTranslations('products')
  const locale = useLocale()

 

const hasDiscount: boolean =
  !!product.priceAfterDiscount && product.priceAfterDiscount < product.price

const discountPct = hasDiscount
  ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
  : 0

const displayPrice = hasDiscount ? product.priceAfterDiscount! : product.price
  const isOutOfStock = product.quantity === 0
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="h-full" 
    >
      <div className={cn(
        'group relative bg-bg rounded-2xl overflow-hidden',
        'border border-[var(--color-border)]',
        'hover:shadow-xl hover:-translate-y-1',
        'transition-all duration-300',
        'h-full flex flex-col'
      )}>

        {/* ── Image Container ── */}
        <div className="relative overflow-hidden bg-bg-secondary aspect-[4/3] sm:aspect-square">
          <Link href={`/products/${product._id}`}>
            {!imageError && product.imageCover?.url ? (
              <Image
                src={product.imageCover.url}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🛍️
              </div>
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-3 start-3 flex flex-col gap-1.5">
            {hasDiscount && (
              <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs font-bold px-2 py-0.5">
                -{discountPct}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-brand hover:bg-brand text-white text-xs px-2 py-0.5">
                {t('featured')}
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {t('outOfStock')}
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <WishlistButton
            productId={product._id}
            size={16}
            className={cn(
              'absolute top-3 end-3',
              'w-9 h-9 rounded-full',
              'flex items-center justify-center',
              'bg-bg/80 backdrop-blur-sm',
              'border border-[var(--color-border)]',
              'opacity-0 group-hover:opacity-100',
              'hover:scale-110',
            )}
          />
          {/* Quick View Button */}
          <div className={cn(
            'absolute bottom-0 left-0 right-0',
            'opacity-0 group-hover:opacity-100',
            'translate-y-full group-hover:translate-y-0',
            'transition-all duration-300',
          )}>
            <Link
              href={`/products/${product._id}`}
              className={cn(
                'flex items-center justify-center gap-2',
                'w-full py-2.5',
                'bg-bg/90 backdrop-blur-sm',
                'text-sm font-medium text-text',
                'border-t border-[var(--color-border)]',
                'hover:bg-brand hover:text-white',
                'transition-colors duration-200',
              )}
            >
              <Eye size={15} />
              {t('quickView')}
            </Link>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-4 flex flex-col flex-1">

          {/* Category + Brand */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted font-medium">
              {product.category?.name}
            </span>
            {product.brand && (
              <span className="text-xs text-brand font-medium">
                {product.brand.name}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/products/${product._id}`}>
            <h3 className={cn(
              'font-semibold text-text text-sm leading-snug mb-3',
              'min-h-[2.5rem]',
              'hover:text-brand transition-colors',
            )}>
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          {product.ratingsQuantity > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={cn(
                      i < Math.round(product.ratingsAverage)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-text-muted">
                ({product.ratingsQuantity})
              </span>
            </div>
          )}

          {/* Colors */}
          {product.color && product.color.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.color.slice(0, 4).map((color) => (
                <div
                  key={color}
                  title={color}
                  className="w-4 h-4 rounded-full border border-[var(--color-border)] cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
              {product.color.length > 4 && (
                <span className="text-xs text-text-muted">
                  +{product.color.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between gap-2 mt-auto">
            <div className="flex flex-col">
              <span className="text-base font-bold text-text">
                {displayPrice?.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')} {t('currency')}
              </span>
              {hasDiscount && (
                <span className="text-xs text-text-muted line-through">
                  {product.price.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')} {t('currency')}
                </span>
              )}
            </div>

            {/* <Button
              size="sm"
              disabled={isOutOfStock}
              className={cn(
                'shrink-0 gap-1.5',
                isOutOfStock
                  ? 'opacity-50 cursor-not-allowed'
                  : 'bg-brand hover:bg-brand-dark text-white'
              )}
              onClick={() => addToCart(
                { productId: product._id },
                { onSuccess: () => openCartDrawer() }  
              )}
            > 
              <ShoppingCart size={14} />
              <span className="hidden sm:block">{t('addToCart')}</span>
            </Button> */}

            <AddCartButton isOutOfStock={isOutOfStock} productId={product._id}  />
          </div>

        </div>
      </div>
    </motion.div>
  )
}