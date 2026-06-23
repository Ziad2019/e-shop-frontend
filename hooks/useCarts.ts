import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
} from '@/lib/api/cart'
import type { AddToCartDto, UpdateCartItemDto, ApplyCouponDto } from '@/types/cart'
import { useAuthStore } from '@/store/authStore'

// ── Query Keys ────────────────────────────────────
export const cartKeys = {
  all: ['cart'] as const,
}

// ── get cart ───────────────────────────────────────
export function useCart() {
   const user = useAuthStore((state) => state.user)
  return useQuery({
    queryKey: cartKeys.all,
    queryFn:  getCart,
     enabled:  !!user,
    staleTime: 30 * 1000, // 30 seconds — cart changes often
    retry: false,         // 404 = empty cart, no need to retry
   
  })
}

// ── add to cart ────────────────────────────────────
export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      addToCart(productId),
    onSuccess: async (data) => {
      // ← await هنا يضمن إن الكارت يتحدث قبل ما نعرض الدروار
      await queryClient.invalidateQueries({ queryKey: cartKeys.all })
      toast.success(data.message ?? 'تمت الإضافة إلى السلة')
    },
    onError: () => {
      toast.error('حدث خطأ أثناء الإضافة إلى السلة')
    },
  })
}

// ── update cart item ───────────────────────────────
export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cartItemId, dto }: { cartItemId: string; dto: UpdateCartItemDto }) =>
      updateCartItem(cartItemId, dto),

    // ── Optimistic Update ──────────────────────────
    onMutate: async ({ cartItemId, dto }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all })

      const previousCart = queryClient.getQueryData(cartKeys.all)

      queryClient.setQueryData(cartKeys.all, (old: any) => {
        if (!old?.data) return old
        return {
          ...old,
          data: {
            ...old.data,
            cartItems: old.data.cartItems.map((item: any) =>
              item._id === cartItemId
                ? { ...item, ...dto }
                : item
            ),
            totalCartPrice: old.data.cartItems.reduce((sum: number, item: any) => {
              const qty = item._id === cartItemId ? (dto.quantity ?? item.quantity) : item.quantity
              return sum + item.price * qty
            }, 0),
          },
        }
      })

      return { previousCart }
    },

   
    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.all, context.previousCart)
      }
      toast.error('حدث خطأ أثناء تحديث السلة')
    },

  
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}

// ── remove cart item ───────────────────────────────
export function useRemoveCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
      toast.success('تم حذف المنتج من السلة')
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف المنتج')
    },
  })
}

// ── apply coupon ───────────────────────────────────
export function useApplyCoupon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: ApplyCouponDto) => applyCoupon(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
      toast.success('تم تطبيق الكوبون بنجاح')
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'الكوبون غير صالح'
      toast.error(message)
    },
  })
}