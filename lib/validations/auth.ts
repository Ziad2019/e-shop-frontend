import { z } from 'zod'



export const registerSchema = z.object({
  name: z.string()
    .min(3,  { message: 'Name must be at least 3 characters' })
    .max(30, { message: 'Name must be at most 30 characters' }),
  email: z.string()
    .email({ message: 'Invalid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path:    ['confirmPassword'],
  }
)

export const loginSchema = z.object({

  email: z.string()
    .email({ message: 'Invalid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  
})


export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const otpSchema = z.object({
  resetCode: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d+$/, "Code must contain numbers only"),
})

export const passwordSchema = z
  .object({
    newPassword:     z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type EmailForm    = z.infer<typeof emailSchema>
export type OtpForm      = z.infer<typeof otpSchema>
export type PasswordForm = z.infer<typeof passwordSchema>