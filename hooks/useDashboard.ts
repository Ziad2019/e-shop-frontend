import { useQuery } from '@tanstack/react-query'
import {
  getOverview, getSalesStats, getTopProducts,
  getRecentOrders, getRecentUsers,
} from '@/lib/api/dashboard'

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn:  getOverview,
    staleTime: 60 * 1000,
  })
}

export function useSalesStats(period: string = 'monthly', year?: number) {
  return useQuery({
    queryKey: ['dashboard', 'sales', period, year],
    queryFn:  () => getSalesStats({ period, year }),
    staleTime: 60 * 1000,
  })
}

export function useDashboardTopProducts(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'top-products', limit],
    queryFn:  () => getTopProducts(limit),
    staleTime: 60 * 1000,
  })
}

export function useDashboardRecentOrders(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recent-orders', limit],
    queryFn:  () => getRecentOrders(limit),
    staleTime: 30 * 1000,
  })
}

export function useDashboardRecentUsers(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'recent-users', limit],
    queryFn:  () => getRecentUsers(limit),
    staleTime: 30 * 1000,
  })
}