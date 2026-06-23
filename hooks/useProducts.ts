import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from '@/lib/api/products'
import type {
  CreateProductDto,
  UpdateProductDto,
  ProductsQueryParams,
} from '@/types/product'
import { AnyARecord } from 'dns'

// ── Query Keys ────────────────────────────────────
export const productKeys = {
  all:     ['products']                                    as const,
  list:    (params?: ProductsQueryParams) => ['products', 'list', params] as const,
  detail:  (id: string) => ['products', id]               as const,
}

// ── get all products (with filters) ───────────────
// في useProducts hook
export function useProducts(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn:  () => getProducts(params),
    enabled:  params !== undefined,
    staleTime: 2 * 60 * 1000,
  })
}
// ── get featured products ──────────────────────────
export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.list({ isFeatured: true, status: 'ACTIVE', limit: 8 }),
    queryFn:  () => getProducts({ isFeatured: true, status: 'ACTIVE', limit: 8 }),
    staleTime: 5 * 60 * 1000,
  })
}

export function useProductsByCategory(categoryId: string, limit = 4) {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn:  () => getProductsByCategory(categoryId, limit),
    enabled:  !!categoryId,
    staleTime: 2 * 60 * 1000,
  })
}
// ── get new arrivals ───────────────────────────────
export function useNewArrivals() {
  return useQuery({
    queryKey: productKeys.list({ isNewArrival: true, status: 'ACTIVE', sort: 'createdAt', sortDir: 'desc', limit: 8 }),
    queryFn:  () => getProducts({ isNewArrival: true, status: 'ACTIVE', sort: 'createdAt', sortDir: 'desc', limit: 8 }),
    staleTime: 5 * 60 * 1000,
  })
}

// ── get products on sale ───────────────────────────
export function useSaleProducts() {
  return useQuery({
    queryKey: productKeys.list({ tag: 'sale', status: 'ACTIVE' }),
    queryFn:  () => getProducts({ tag: 'sale', status: 'ACTIVE' }),
    staleTime: 5 * 60 * 1000,
  })
}

// ── get product by ID ──────────────────────────────
export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn:  () => getProductById(id),
    enabled:  !!id,
        retry: 2,                    
    retryDelay: 500,
    staleTime: 60 * 1000, 
  })
}

// ── create product — Admin ─────────────────────────
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateProductDto) => createProduct(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}

// ── update product — Admin ─────────────────────────
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
      updateProduct(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
    },
  })
}

// ── delete product — Admin ─────────────────────────
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all })
    },
  })
}