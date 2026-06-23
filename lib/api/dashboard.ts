import axiosInstance from '@/lib/axios'
import type {
  ApiWrapped, DashboardOverview, SalesStats,
  TopProduct, RecentOrder, RecentUser,
} from '@/types/dashboard'

export const getOverview = async (): Promise<ApiWrapped<DashboardOverview>> => {
  const { data } = await axiosInstance.get('/dashboard/overview')
  return data
}

export const getSalesStats = async (params?: { period?: string; year?: number }): Promise<ApiWrapped<SalesStats>> => {
  const { data } = await axiosInstance.get('/dashboard/sales', { params })
  return data
}

export const getTopProducts = async (limit = 5): Promise<ApiWrapped<TopProduct[]>> => {
  const { data } = await axiosInstance.get('/dashboard/top-products', { params: { limit } })
  return data
}

export const getRecentOrders = async (limit = 5): Promise<ApiWrapped<RecentOrder[]>> => {
  const { data } = await axiosInstance.get('/dashboard/recent-orders', { params: { limit } })
  return data
}

export const getRecentUsers = async (limit = 5): Promise<ApiWrapped<RecentUser[]>> => {
  const { data } = await axiosInstance.get('/dashboard/recent-users', { params: { limit } })
  return data
}