export interface DashboardOverview {
  totalUsers:       number
  activeUsers:      number
  totalProducts:    number
  lowStockProducts: number
  totalOrders:      number
  totalCategories:  number
  totalReviews:     number
  totalCoupons:     number
  totalRevenue:     number
  ordersByStatus: {
    pending:   number
    paid:      number
    delivered: number
  }
}

export interface SalesStatsItem {
  period:      string
  revenue:     number
  ordersCount: number
}

export interface SalesStats {
  year:         number
  period:       string
  totalRevenue: number
  chart:        SalesStatsItem[]
}

export interface TopProduct {
  _id:             string
  title:           string
  price:           number
  sold:            number
  ratingsAverage:  number
  ratingsQuantity: number
  imageCover?:     { url: string; thumbnailUrl?: string }
  category?:       { name: string }
}

export interface RecentOrder {
  _id:                string
  user:               { name: string; email: string; avatar?: string }
  totalOrderPrice:    number
  isPaid:             boolean
  isDelivered:        boolean
  paymentMethodType:  string
  createdAt:          string
  cartItems:          any[]
}

export interface RecentUser {
  _id:       string
  name:      string
  email:     string
  role:      string
  avatar?:   string
  active:    boolean
  createdAt: string
}

export interface ApiWrapped<T> {
  status:  number
  message: string
  length?: number
  data:    T
}