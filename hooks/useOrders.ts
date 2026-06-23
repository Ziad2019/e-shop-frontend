import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { cartKeys } from './useCarts'
import type { CreateOrderDto } from '@/types/order'
import { createCashOrder, createCheckoutSession, getAllOrders, getMyOrders, getOrderById, markOrderAsDelivered, markOrderAsPaid } from '@/lib/api/order'

// ── Query Keys ────────────────────────────────────
export const orderKeys = {
  all:    ['orders']               as const,
  mine:   ['orders', 'mine']       as const,
  detail: (id: string) => ['orders', id] as const,
}

// ── create cash order ──────────────────────────────
export function useCreateCashOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cartId, dto }: { cartId: string; dto: CreateOrderDto }) =>
      createCashOrder(cartId, dto),
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      queryClient.invalidateQueries({ queryKey: orderKeys.mine })
      toast.success('تم إنشاء طلبك بنجاح')
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'حدث خطأ أثناء إنشاء الطلب'
      toast.error(message)
    },
  })
}

// ── create stripe checkout session (card payment) ─
export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (cartId: string) => createCheckoutSession(cartId),
    onSuccess: (data) => {
      // Stripe بيرجع session فيها url بتاع صفحة الدفع، نوجه المستخدم لها
      if (data.session?.url) {
        window.location.href = data.session.url
      }
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message ?? 'حدث خطأ أثناء بدء الدفع'
      toast.error(message)
    },
  })
}

// ── get logged-in user's orders ────────────────────
export function useMyOrders() {
  return useQuery({
    queryKey: orderKeys.mine,
    queryFn:  getMyOrders,
    staleTime: 60 * 1000,
  })
}

// ── get specific order ─────────────────────────────
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn:  () => getOrderById(id),
    enabled:  !!id,
  })
}

// ── admin: get all orders ──────────────────────────
export function useAllOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn:  getAllOrders,
    staleTime: 60 * 1000,
  })
}

// ── admin: mark as paid ────────────────────────────
export function useMarkOrderAsPaid() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markOrderAsPaid(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) })
      toast.success('تم تحديث حالة الدفع')
    },
  })
}

// ── admin: mark as delivered ───────────────────────
export function useMarkOrderAsDelivered() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markOrderAsDelivered(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all })
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) })
      toast.success('تم تحديث حالة التوصيل')
    },
  })
}