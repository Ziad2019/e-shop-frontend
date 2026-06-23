// ============================================================
// CART TYPES
// ============================================================
import type { ProductImage } from './product'

// ── Cart Item ──────────────────────────────────────
// Product inside a cart item is "lite" — only the fields the
// backend populates (title, price, image) via .populate()
export interface CartItemProduct {
  _id:        string
  title:      string
  price:      number
  imageCover?: ProductImage
}

export interface CartItem {
  _id:      string
  product:  CartItemProduct | string   // populated object OR raw id (before populate)
  color:    string
  quantity: number
  price:    number   // price locked-in at the time item was added
}

// ── Cart ───────────────────────────────────────────
export interface Cart {
  _id:                      string
  user:                     string
  cartItems:                CartItem[]
  totalCartPrice:           number
  totalPriceAfterDiscount?: number
  createdAt:                string
  updatedAt:                string
}

// ── Responses ──────────────────────────────────────
export interface CartResponse {
  status:         string
  message?:       string
  numOfCartItems: number
  data:           Cart
}

// ── DTOs ───────────────────────────────────────────
export interface AddToCartDto {
  color?: string
}

export interface UpdateCartItemDto {
  quantity?: number
  color?:    string
}

export interface ApplyCouponDto {
  name: string
}