import axiosInstance from '@/lib/axios'
import type { ProductResponse, ProductsResponse, ProductsQueryParams } from '@/types/product'

export const adminGetProducts = async (params?: ProductsQueryParams): Promise<ProductsResponse> => {
  const cleanParams = Object.fromEntries(
    Object.entries(params ?? {}).filter(([_, v]) => v !== undefined && v !== '')
  )
  const { data } = await axiosInstance.get<ProductsResponse>('/products', { params: cleanParams })
  return data
}

export const adminGetProduct = async (id: string): Promise<ProductResponse> => {
  const { data } = await axiosInstance.get<ProductResponse>(`/products/${id}`)
  return data
}

export const adminCreateProduct = async (formData: FormData): Promise<ProductResponse> => {
  const { data } = await axiosInstance.post<ProductResponse>('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const adminUpdateProduct = async (id: string, payload: Record<string, any>): Promise<ProductResponse> => {
  const { data } = await axiosInstance.patch<ProductResponse>(`/products/${id}`, payload)
  return data
}

export const adminDeleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`)
}