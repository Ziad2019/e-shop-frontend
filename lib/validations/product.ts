import { z } from 'zod'

export const productSchema = z.object({
  title:              z.string().min(3).max(200),
  description:        z.string().min(20).optional().or(z.literal('')),
  quantity:            z.coerce.number().min(1).optional(),
  price:               z.coerce.number().min(1).max(20000),
  priceAfterDiscount:  z.coerce.number().min(0).max(50000).optional(),
  color:               z.string().optional(),
  category:            z.string().min(1, 'Category is required'),
  subCategory:         z.string().optional(),
  brand:               z.string().optional(),
  status:              z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']).optional(),
  isFeatured:          z.boolean().optional(),
  tags:                z.array(z.string()).optional(),
})

export type ProductFormData = z.input<typeof productSchema>