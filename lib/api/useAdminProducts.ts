import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  adminGetProducts, adminGetProduct,
  adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
} from '@/lib/api/admin-products'
import type { ProductsQueryParams } from '@/types/product'

export const adminProductKeys = {
  all:    ['admin', 'products']                                  as const,
  list:   (params?: ProductsQueryParams) => ['admin', 'products', 'list', params] as const,
  detail: (id: string) => ['admin', 'products', 'detail', id]    as const,
}

export function useAdminProducts(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: adminProductKeys.list(params),
    queryFn:  () => adminGetProducts(params),
    staleTime: 30 * 1000,
  })
}

export function useAdminProduct(id?: string) {
  return useQuery({
    queryKey: adminProductKeys.detail(id ?? ''),
    queryFn:  () => adminGetProduct(id!),
    enabled:  !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => adminCreateProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, any> }) =>
      adminUpdateProduct(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all })
      queryClient.invalidateQueries({ queryKey: adminProductKeys.detail(id) })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminDeleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all })
    },
  })
}