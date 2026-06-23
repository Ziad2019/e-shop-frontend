import axiosInstance from '@/lib/axios'
import type { WishlistResponse } from '@/types/wishlist'

export const getWishlist = async (): Promise<WishlistResponse> => {
  const { data } = await axiosInstance.get<WishlistResponse>('/wishlist')
  return data
}

export const addToWishlist = async (productId: string): Promise<WishlistResponse> => {
  const { data } = await axiosInstance.post<WishlistResponse>(`/wishlist/${productId}`)
  return data
}

export const removeFromWishlist = async (productId: string): Promise<WishlistResponse> => {
  const { data } = await axiosInstance.delete<WishlistResponse>(`/wishlist/${productId}`)
  return data
}