import axiosInstance from '@/lib/axios'
import type {
  CartResponse,
  AddToCartDto,
  UpdateCartItemDto,
  ApplyCouponDto,
} from '@/types/cart'

// ── Add product to cart ───────────────────────────
export const addToCart = async (
  productId: string,
  // dto?:      AddToCartDto,
): Promise<CartResponse> => {
  const { data } = await axiosInstance.post<CartResponse>(
    `/cart/${productId}`,
    // dto ?? {},
  )
  return data
}

// ── Get logged-in user's cart ─────────────────────
export const getCart = async (): Promise<CartResponse> => {
  const { data } = await axiosInstance.get<CartResponse>('/cart')
  return data
}

// ── Update cart item (quantity / color) ───────────
export const updateCartItem = async (
  cartItemId: string,
  dto:        UpdateCartItemDto,
): Promise<CartResponse> => {
  const { data } = await axiosInstance.put<CartResponse>(`/cart/${cartItemId}`, dto)
  return data
}

// ── Remove item from cart ─────────────────────────
export const removeCartItem = async (itemId: string): Promise<CartResponse> => {
  const { data } = await axiosInstance.delete<CartResponse>(`/cart/${itemId}`)
  return data
}

// ── Apply coupon ───────────────────────────────────
export const applyCoupon = async (dto: ApplyCouponDto): Promise<CartResponse> => {
  const { data } = await axiosInstance.patch<CartResponse>('/cart/applyCoupon', dto)
  return data
}