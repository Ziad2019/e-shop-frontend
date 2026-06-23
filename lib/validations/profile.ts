import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(30, { message: 'Name must be at most 30 characters' }),
  age: z.coerce.number()
    .min(0).max(120)
    .optional()
    .or(z.literal('')),
  phoneNumber: z.string().optional(),
  address:     z.string().optional(),
  gender:      z.enum(['male', 'female']).optional(),
})

export type ProfileFormData = z.input<typeof profileSchema>