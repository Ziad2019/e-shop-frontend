import axiosInstance from '@/lib/axios'
import type {
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/types/category'

// ── Public ───────────────────────────────────────

// get all categories
export const getCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await axiosInstance.get<CategoriesResponse>('/categories')
  return data
}

// get category by ID
export const getCategoryById = async (id: string): Promise<CategoryResponse> => {
  const { data } = await axiosInstance.get<CategoryResponse>(`/categories/${id}`)
  return data
}

// ── Admin Only ───────────────────────────────────

// create category 
export const createCategory = async (dto: CreateCategoryDto): Promise<CategoryResponse> => {
// since we need to send an image file, we have to use FormData and set the content type to multipart/form-data
    const formData = new FormData()
  formData.append('name', dto.name)
  if (dto.image) {
    formData.append('image', dto.image)
  }

  const { data } = await axiosInstance.post<CategoryResponse>('/categories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// update category
export const updateCategory = async (
  id:  string,
  dto: UpdateCategoryDto
): Promise<CategoryResponse> => {
  const formData = new FormData()
  if (dto.name)  formData.append('name',  dto.name)
  if (dto.image) formData.append('image', dto.image)

  const { data } = await axiosInstance.patch<CategoryResponse>(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

// delete category
export const deleteCategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/categories/${id}`)
}