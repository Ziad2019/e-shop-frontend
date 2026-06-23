import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/api/categories'
import type { CreateCategoryDto, UpdateCategoryDto } from '@/types/category'

// ── Query Keys ───────────────────────────────────
export const categoryKeys = {
  all:    ['categories']          as const,
  detail: (id: string) => ['categories', id] as const,
}

// get all categories
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn:  getCategories,
    staleTime: 5 * 60 * 1000, 
  })
}
// get category by id
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn:  () => getCategoryById(id),
    enabled:  !!id, 
  })
}

// create category — Admin
export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => createCategory(dto),
    onSuccess: () => {
 
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}

// ── update category — Admin ───────────────────────
export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryDto }) =>
      updateCategory(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(id) })
    },
  })
}

// ── delete category — Admin ─────────────────────────
export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    },
  })
}