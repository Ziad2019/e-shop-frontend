'use client'

import Image from 'next/image'
import { Trash2, Minus, Plus,   } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { CartItem, CartItemProduct } from '@/types/cart'
import {  useRemoveCartItem, useUpdateCartItem } from '@/hooks/useCarts'


export function CartItemRow({ item, locale }: { item: CartItem; locale: string }) {
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem()
  const { mutate: removeItem, isPending: isRemoving }  = useRemoveCartItem()

  const product = typeof item.product === 'object'
    ? (item.product as CartItemProduct)
    : null
console.log(product)
  const title    = product?.title ?? '...'
  const imageUrl = product?.imageCover?.url

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return
    updateItem({ cartItemId: item._id, dto: { quantity: newQty } })
  }

  return (
    <div className={cn(
      'flex gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-bg transition-opacity',
      (isUpdating || isRemoving) && 'opacity-50 pointer-events-none'
    )}>
      {/* Image */}
      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-bg-secondary">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" sizes="80px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text line-clamp-1">{title}</h3>

        {item.color && (
          <p className="text-sm text-text-muted mt-0.5">
            {locale === 'ar' ? 'اللون' : 'Color'}: {item.color}
          </p>
        )}

        <p className="text-brand font-bold mt-1">
          {item.price.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-bg-secondary disabled:opacity-40 transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center font-semibold text-text">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-bg-secondary transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Remove + Subtotal */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(item._id)}
          className="text-text-muted hover:text-red-500 transition-colors p-1"
        >
          <Trash2 size={18} />
        </button>
        <p className="font-bold text-text">
          {(item.price * item.quantity).toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
        </p>
      </div>
    </div>
  )
}