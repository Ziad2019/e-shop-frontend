import { z } from 'zod'

// ============================================================
// CHECKOUT FORM SCHEMA
// ============================================================
export const checkoutSchema = z.object({
  details: z
    .string()
    .min(5, 'العنوان التفصيلي يجب أن يكون 5 أحرف على الأقل')
    .max(200, 'العنوان طويل جداً'),

  // رقم مصري: يبدأ بـ 01 ويتبعه 9 أرقام (إجمالي 11 رقم)
  phone: z
    .string()
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, 'رقم الهاتف غير صحيح (مثال: 01012345678)'),

  city: z
    .string()
    .min(2, 'يرجى إدخال اسم المدينة'),

  postalCode: z
    .string()
    .min(3, 'الرمز البريدي غير صحيح')
    .optional()
    .or(z.literal('')),

  paymentMethodType: z.enum(['cash', 'card']),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>