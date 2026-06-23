import axiosInstance from '@/lib/axios'
import type {
  OrderResponse,
  OrdersResponse,
  CreateOrderDto,
  CheckoutSessionResponse,
} from '@/types/order'

// ── Create cash order ──────────────────────────────
export const createCashOrder = async (
  cartId: string,
  dto:    CreateOrderDto,
): Promise<OrderResponse> => {
  const { data } = await axiosInstance.post<OrderResponse>(`/orders/${cartId}`, dto)
  return data
}

// ── Create Stripe checkout session (card payment) ─
export const createCheckoutSession = async (
  cartId: string,
): Promise<CheckoutSessionResponse> => {
  const { data } = await axiosInstance.post<CheckoutSessionResponse>(
    `/orders/checkout-session/${cartId}`,
  )
  return data
}


// ── Get logged-in user's orders ────────────────────
export const getMyOrders = async (): Promise<OrdersResponse> => {
  const { data } = await axiosInstance.get<OrdersResponse>('/orders/my-orders')
  return data
}

// ── Get specific order ──────────────────────────────
export const getOrderById = async (id: string): Promise<OrderResponse> => {
  const { data } = await axiosInstance.get<OrderResponse>(`/orders/${id}`)
  return data
}

// ── Admin: get all orders ──────────────────────────
export const getAllOrders = async (): Promise<OrdersResponse> => {
  const { data } = await axiosInstance.get<OrdersResponse>('/orders')
  return data
}

// ── Admin: mark order as paid ──────────────────────
export const markOrderAsPaid = async (id: string): Promise<OrderResponse> => {
  const { data } = await axiosInstance.patch<OrderResponse>(`/orders/${id}/pay`)
  return data
}

// ── Admin: mark order as delivered ─────────────────
export const markOrderAsDelivered = async (id: string): Promise<OrderResponse> => {
  const { data } = await axiosInstance.patch<OrderResponse>(`/orders/${id}/deliver`)
  return data
}