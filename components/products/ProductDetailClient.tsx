'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import {
    ShoppingCart, Heart, Star, ChevronLeft,
    ChevronRight, Truck, Shield, RotateCcw, Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useProduct } from '@/hooks/useProducts'
import { useProducts } from '@/hooks/useProducts'
import ProductCard from './ProductCard'
import { useAddToCart } from '@/hooks/useCarts'
import { useCartDrawer } from '../cart/CartDrawerContext'

interface Props { id: string }

export default function ProductDetailClient({ id }: Props) {

    const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart()
   const { open: openCartDrawer } = useCartDrawer()

    const t = useTranslations('products')
    const locale = useLocale()
    const isRTL = locale === 'ar'

    const { data, isLoading, isError,refetch  } = useProduct(id)
    const product = data?.data

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description')


    const { data: relatedData } = useProducts(
        product?.category?._id
            ? { category: product.category._id, limit: 4, status: 'ACTIVE' }
            : undefined,
    )
    const relatedProducts = relatedData?.data?.filter(p => p._id !== id) ?? []

if (isLoading) return <ProductDetailSkeleton />
if (isError) return <ProductErrorState onRetry={() => refetch()} />  
if (!product)  return notFound()

    const hasDiscount = !!product.priceAfterDiscount &&
        product.priceAfterDiscount > 0 &&
        product.priceAfterDiscount < product.price
    const displayPrice = hasDiscount ? product.priceAfterDiscount! : product.price
    const discountPct = hasDiscount
        ? Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100)
        : 0
    const isOutOfStock = product.quantity === 0

    const allImages = [
        product.imageCover,
        ...(product.images ?? []),
    ].filter(Boolean)

    return (
        <div className="container-custom py-8">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-text-muted mb-8 flex-wrap">
                <Link href="/" className="hover:text-brand transition-colors">
                    {locale === 'ar' ? 'الرئيسية' : 'Home'}
                </Link>
                <span>/</span>
                <Link href="/products" className="hover:text-brand transition-colors">
                    {t('title')}
                </Link>
                {product.category && (
                    <>
                        <span>/</span>
                        <Link
                            href={`/products?category=${product.category._id}`}
                            className="hover:text-brand transition-colors"
                        >
                            {product.category.name}
                        </Link>
                    </>
                )}
                <span>/</span>
                <span className="text-text font-medium line-clamp-1">{product.title}</span>
            </nav>

            {/* ── Main Section ── */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">

                {/* ── Gallery ── */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <motion.div
                        key={selectedImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative aspect-square rounded-2xl overflow-hidden bg-bg-secondary border border-[var(--color-border)]"
                    >
                        {allImages[selectedImage]?.url ? (
                            <Image
                                src={allImages[selectedImage].url}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-8xl">🛍️</div>
                        )}

                        {/* Discount Badge */}
                        {hasDiscount && (
                            <Badge className="absolute top-4 start-4 bg-red-500 text-white text-sm font-bold">
                                -{discountPct}%
                            </Badge>
                        )}

                        {/* Navigation Arrows */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={() => setSelectedImage(i => (i - 1 + allImages.length) % allImages.length)}
                                    className="absolute top-1/2 -translate-y-1/2 start-3 w-9 h-9 rounded-full bg-bg/80 backdrop-blur flex items-center justify-center hover:bg-bg transition-colors"
                                >
                                    {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                                </button>
                                <button
                                    onClick={() => setSelectedImage(i => (i + 1) % allImages.length)}
                                    className="absolute top-1/2 -translate-y-1/2 end-3 w-9 h-9 rounded-full bg-bg/80 backdrop-blur flex items-center justify-center hover:bg-bg transition-colors"
                                >
                                    {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                                </button>
                            </>
                        )}
                    </motion.div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {allImages.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={cn(
                                        'relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all',
                                        i === selectedImage
                                            ? 'border-brand'
                                            : 'border-[var(--color-border)] opacity-60 hover:opacity-100'
                                    )}
                                >
                                    <Image src={img.url} alt={`${i + 1}`} fill className="object-cover" sizes="64px" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Info ── */}
                <div className="space-y-6">

                    {/* Category + Brand */}
                    <div className="flex items-center gap-2">
                        {product.category && (
                            <Badge variant="secondary" className="text-xs">
                                {product.category.name}
                            </Badge>
                        )}
                        {product.brand && (
                            <Badge className="text-xs bg-brand/10 text-brand hover:bg-brand/10">
                                {product.brand.name}
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-text leading-snug">
                        {product.title}
                    </h1>

                    {/* Rating */}
                    {product.ratingsQuantity > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={cn(
                                            i < Math.round(product.ratingsAverage)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-text-muted">
                                {product.ratingsAverage.toFixed(1)} ({product.ratingsQuantity} {locale === 'ar' ? 'تقييم' : 'reviews'})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-text">
                            {displayPrice.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
                        </span>
                        {hasDiscount && (
                            <span className="text-lg text-text-muted line-through">
                                {product.price.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
                            </span>
                        )}
                    </div>

                    {/* Colors */}
                    {product.color && product.color.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-text mb-2">
                                {locale === 'ar' ? 'اللون' : 'Color'}:
                                {selectedColor && <span className="text-brand ms-1">{selectedColor}</span>}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {product.color.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                                        title={color}
                                        className={cn(
                                            'px-3 py-1.5 rounded-lg text-sm border-2 transition-all',
                                            selectedColor === color
                                                ? 'border-brand bg-brand/10 text-brand font-medium'
                                                : 'border-[var(--color-border)] text-text-muted hover:border-brand/50'
                                        )}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <p className="text-sm font-medium text-text mb-2">
                            {locale === 'ar' ? 'الكمية' : 'Quantity'}
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center hover:bg-bg-secondary transition-colors text-lg font-bold"
                            >
                                −
                            </button>
                            <span className="text-lg font-bold text-text w-8 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                                className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center hover:bg-bg-secondary transition-colors text-lg font-bold"
                            >
                                +
                            </button>
                            <span className="text-sm text-text-muted">
                                ({product.quantity} {locale === 'ar' ? 'متاح' : 'available'})
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            size="lg"
                            disabled={isOutOfStock}
                            className="flex-1 bg-brand hover:bg-brand-dark text-white gap-2"
                            onClick={() => addToCart({ productId: id },{ onSuccess: () => openCartDrawer() })}
                        >
                            <ShoppingCart size={18} />
                            {isOutOfStock
                                ? (locale === 'ar' ? 'غير متوفر' : 'Out of Stock')
                                : t('addToCart')
                            }
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={cn(isWishlisted && 'text-red-500 border-red-200')}
                        >
                            <Heart size={18} className={cn(isWishlisted && 'fill-red-500')} />
                        </Button>
                        <Button size="lg" variant="outline">
                            <Share2 size={18} />
                        </Button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-border)]">
                        {[
                            { icon: Truck, text: locale === 'ar' ? 'شحن مجاني' : 'Free Shipping' },
                            { icon: Shield, text: locale === 'ar' ? 'ضمان الجودة' : 'Quality Guarantee' },
                            { icon: RotateCcw, text: locale === 'ar' ? 'إرجاع مجاني' : 'Free Returns' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex flex-col items-center gap-1.5 text-center p-3 rounded-xl bg-bg-secondary">
                                <Icon size={20} className="text-brand" />
                                <span className="text-xs text-text-muted">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="mb-16">
                <div className="flex gap-1 border-b border-[var(--color-border)] mb-6">
                    {(['description', 'reviews'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                'px-6 py-3 text-sm font-medium transition-colors -mb-px border-b-2',
                                activeTab === tab
                                    ? 'border-brand text-brand'
                                    : 'border-transparent text-text-muted hover:text-text'
                            )}
                        >
                            {tab === 'description'
                                ? (locale === 'ar' ? 'الوصف' : 'Description')
                                : (locale === 'ar' ? 'التقييمات' : 'Reviews')
                            }
                        </button>
                    ))}
                </div>

                {activeTab === 'description' && (
                    <div className="prose prose-sm max-w-none text-text-muted leading-relaxed">
                        {product.description}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="text-center py-12 text-text-muted">
                        <Star size={40} className="mx-auto mb-3 text-yellow-400" />
                        <p>{locale === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}</p>
                    </div>
                )}
            </div>

            {/* ── Related Products ── */}
            {relatedProducts.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-text mb-6">
                        {locale === 'ar' ? 'منتجات مشابهة' : 'Related Products'}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.slice(0, 4).map((p, index) => (
                            <ProductCard key={p._id} product={p} index={index} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

// ── Skeleton ──────────────────────────────────────
function ProductDetailSkeleton() {
    return (
        <div className="container-custom py-8">
            <div className="grid lg:grid-cols-2 gap-8">
                <Skeleton className="aspect-square rounded-2xl" />
                <div className="space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    )
}


function ProductErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="container-custom py-20 text-center">
      <p className="text-text-muted mb-4">حدث خطأ في تحميل المنتج، حاول تاني</p>
      <Button onClick={onRetry}>إعادة المحاولة</Button>
    </div>
  )
}