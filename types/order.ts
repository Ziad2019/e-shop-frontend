// ============================================================
// ORDER TYPES
// ============================================================

export type PaymentMethod = 'cash' | 'card'

// ── Sub-types ──────────────────────────────────────
export interface ShippingAddress {
  details?:    string
  phone?:      string
  city?:       string
  postalCode?: string
}

export interface OrderItemProduct {
  _id:   string
  title: string
  price: number
}

export interface OrderItem {
  _id:      string
  product:  OrderItemProduct | string
  color:    string
  quantity: number
  price:    number
}

// ── Main Order ─────────────────────────────────────
export interface Order {
  _id:                string
  user:               string
  cartItems:          OrderItem[]
  shippingAddress:    ShippingAddress
  taxPrice:           number
  shippingPrice:      number
  totalOrderPrice:    number
  paymentMethodType:  PaymentMethod
  isPaid:             boolean
  paidAt?:             string
  isDelivered:        boolean
  deliveredAt?:        string
  createdAt:          string
  updatedAt:          string
}

// ── Responses ──────────────────────────────────────
export interface OrderResponse {
  status:  number
  message: string
  data:    Order
}

export interface OrdersResponse {
  status:  number
  message: string
  length:  number
  data:    Order[]
}

export interface CheckoutSessionResponse {
  status:  number
  message: string
  session: {
    id:  string
    url: string
  }
}

// ── DTOs ───────────────────────────────────────────
export interface CreateOrderDto {
  shippingAddress?:   ShippingAddress
  paymentMethodType?: PaymentMethod
}