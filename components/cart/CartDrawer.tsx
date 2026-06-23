'use client'
import Link  from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCarts'
import { useCartDrawer } from './CartDrawerContext'
import type { CartItem, CartItemProduct } from '@/types/cart'

export default function CartDrawer() {
  const { isOpen, close } = useCartDrawer()
  const locale = useLocale()
  const isRTL  = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const { data, isLoading } = useCart()
  const cart      = data?.data
  const cartItems = cart?.cartItems ?? []
  const numItems  = data?.numOfCartItems ?? 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          />

          {/* ── Drawer ── */}
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={cn(
              'fixed top-0 h-full w-full sm:w-[420px] bg-bg z-[70] flex flex-col shadow-2xl',
              isRTL ? 'start-0' : 'end-0',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
              <h2 className="font-bold text-text text-lg flex items-center gap-2">
                <ShoppingBag size={20} />
                {locale === 'ar' ? `سلة التسوق (${numItems})` : `Shopping Cart (${numItems})`}
              </h2>
              <button
                onClick={close}
                className="p-2 rounded-xl hover:bg-bg-secondary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {isLoading ? (
                <DrawerSkeleton />
              ) : cartItems.length === 0 ? (
                <EmptyDrawer locale={locale} onClose={close} />
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <DrawerItemRow key={item._id} item={item} locale={locale} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer — Summary + CTA */}
            {!isLoading && cartItems.length > 0 && (
              <div className="border-t border-[var(--color-border)] p-5 space-y-4 bg-bg">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span>{cart?.totalCartPrice.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-muted">
                    <span>{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
                    <span className="text-green-600">{locale === 'ar' ? 'مجاني' : 'Free'}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2">
                    <span className="font-bold text-text">{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
                    <span className="text-xl font-black text-text">
                      {(cart?.totalPriceAfterDiscount ?? cart?.totalCartPrice ?? 0).toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  
                  className="w-full bg-brand hover:bg-brand-dark  gap-2"
                >
                  <Link href="/checkout" onClick={close} className='text-white flex'>
                    {locale === 'ar' ? 'إتمام الطلب' : 'Checkout'}
                    <ArrowIcon size={18}  className='mt-1'/>
                  </Link>
                </Button>

                <Link
                  href="/cart"
                  onClick={close}
                  className="block text-center text-sm text-text-muted hover:text-brand transition-colors"
                >
                  {locale === 'ar' ? 'عرض السلة كاملة' : 'View Full Cart'}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ============================================================
// DRAWER ITEM ROW
// ============================================================
function DrawerItemRow({ item, locale }: { item: CartItem; locale: string }) {
  const { mutate: updateItem } = useUpdateCartItem()
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem()

  const product = typeof item.product === 'object'
    ? (item.product as CartItemProduct)
    : null

  const title    = product?.title ?? '...'
  const imageUrl = product?.imageCover?.url

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return
    updateItem({ cartItemId: item._id, dto: { quantity: newQty } })
  }

  return (
    <div className={cn(
      'flex gap-3 p-3 rounded-xl border border-[var(--color-border)] transition-opacity',
      isRemoving && 'opacity-40 pointer-events-none'
    )}>
      {/* Image */}
      <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-bg-secondary">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" sizes="64px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-text line-clamp-1">{title}</h4>
        <p className="text-brand font-bold text-sm mt-0.5">
          {item.price.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
        </p>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-6 h-6 rounded-md border border-[var(--color-border)] flex items-center justify-center hover:bg-bg-secondary disabled:opacity-40 transition-colors"
            >
              <Minus size={11} />
            </button>
            <span className="w-5 text-center text-sm font-semibold text-text">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-6 h-6 rounded-md border border-[var(--color-border)] flex items-center justify-center hover:bg-bg-secondary transition-colors"
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => removeItem(item._id)}
            className="text-text-muted hover:text-red-500 transition-colors p-1"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// EMPTY STATE
// ============================================================
function EmptyDrawer({ locale, onClose }: { locale: string; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center mb-5">
        <ShoppingBag size={32} className="text-text-muted" />
      </div>
      <h3 className="font-bold text-text mb-1">
        {locale === 'ar' ? 'سلتك فاضية' : 'Your cart is empty'}
      </h3>
      <p className="text-sm text-text-muted mb-5">
        {locale === 'ar' ? 'تصفح المنتجات وأضف ما يناسبك' : 'Browse products and add items'}
      </p>
      <Button  className="bg-brand hover:bg-brand-dark ">
        <Link href="/products" onClick={onClose} className='text-white'>
          {locale === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
        </Link>
      </Button>
    </div>
  )
}

// ============================================================
// SKELETON
// ============================================================
function DrawerSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>
  )
}