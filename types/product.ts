// ============================================================
// PRODUCT TYPES
// ============================================================

export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED'

export type ProductTag = 'new-arrival' | 'sale' | 'trending' | 'best-seller' | 'limited'

export type SortField = 'price' | 'ratingsAverage' | 'createdAt' | 'sold' | 'views' | 'title'

export type SortDir = 'asc' | 'desc'

// ── Sub-types ─────────────────────────────────────
export interface ProductImage {
  _id: string
  url: string
  alt?: string
}

export interface ProductCategory {
  _id:  string
  name: string
  slug: string
}

export interface ProductBrand {
  _id:  string
  name: string
}

// ── Main Product ──────────────────────────────────
export interface Product {
  _id:                string
  slug:               string
  description:        string
  title:              string
  quantity:           number
  sold:               number
  price:              number
  priceAfterDiscount?: number
  discountPercentage?: number   // virtual field from backend
  color:              string[]
  status:             ProductStatus
  isFeatured:         boolean
  tags:               ProductTag[]
  views:              number
  lowStockThreshold:  number
  imageCover:         ProductImage
  images:             ProductImage[]
  category:           ProductCategory
  brand:              ProductBrand
  ratingsAverage:     number
  ratingsQuantity:    number
  createdAt:          string
  updatedAt:          string
}

// ── Responses ─────────────────────────────────────
export interface ProductsResponse {
  status:   number
  message:  string
  length:   number
  total:    number
  page:     number
  pages:    number
  data:     Product[]
}

export interface ProductResponse {
  status:  number
  message: string
  data:    Product
}


// ── Query Params ──────────────────────────────────
export interface ProductsQueryParams {
  // Pagination
  page?:         number
  limit?:        number
  fields?:       string
  // Search & Sort
  keyword?:      string
  sort?:         SortField
  sortDir?:      SortDir
  // Filters
  category?:     string
  brand?:        string
  tag?:          ProductTag
  // Price & Rating
  priceMin?:     number
  priceMax?:     number
  ratingMin?:    number
  ratingMax?:    number
  // Status & Flags
  status?:       ProductStatus
  isFeatured?:   boolean
  inStock?:      boolean
  isNewArrival?: boolean
}

// ── DTOs ──────────────────────────────────────────
export interface CreateProductDto {
  title:               string
  description:         string
  price:               any
  quantity:            any
  color?:              string
  category:            string
  brand?:              string
  priceAfterDiscount?: number
  status?:             ProductStatus
  isFeatured?:         boolean
  tags?:               ProductTag[]
  imageCover:          File
  images?:             File[]
}

export interface UpdateProductDto {
  title?:              string
  description?:        string
  price?:              number
  quantity?:           number
  color?:              string
  category?:           string
  brand?:              string
  priceAfterDiscount?: number
  status?:             ProductStatus
  isFeatured?:         boolean
  tags?:               ProductTag[]
  imageCover?:         File
  images?:             File[]
}