import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWishlist, addToWishlist, removeFromWishlist } from '@/lib/api/wishlist'
import { useAuthStore } from '@/store/authStore'

export const wishlistKeys = {
  all: ['wishlist'] as const,
}


export function useWishlist() {
  const isAuth = useAuthStore((state) => !!state.accessToken)

  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn:  getWishlist,
    enabled:  isAuth, 
    staleTime: 60 * 1000,
  })
}


export function useAddToWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => addToWishlist(productId),
    onSuccess: (data) => {
      queryClient.setQueryData(wishlistKeys.all, data)
    },
  })
}


export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onSuccess: (data) => {
      queryClient.setQueryData(wishlistKeys.all, data)
    },
  })
}


export function useIsInWishlist(productId: string) {
  const { data } = useWishlist()
  return data?.data?.products?.some((p) => p._id === productId) ?? false
}