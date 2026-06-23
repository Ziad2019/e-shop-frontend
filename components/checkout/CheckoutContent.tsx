'use client'
import Link  from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Phone, Building2, Hash, Banknote, CreditCard, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/useCarts'
import { useCreateCashOrder, useCreateCheckoutSession } from '@/hooks/useOrders'
import { checkoutSchema, type CheckoutFormValues } from '@/lib/validations/checkout-schema'
import type { CartItemProduct } from '@/types/cart'

export default function CheckoutContent() {
  const locale = useLocale()

  const { data: cartData, isLoading: isCartLoading } = useCart()
  const cart      = cartData?.data
  const cartItems = cart?.cartItems ?? []
  const isEmpty   = !isCartLoading && cartItems.length === 0

  const { mutate: createCashOrder,    isPending: isCreatingCash } = useCreateCashOrder()
  const { mutate: createCardSession,  isPending: isCreatingCard } = useCreateCheckoutSession()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver:     zodResolver(checkoutSchema),
    defaultValues: { paymentMethodType: 'cash' },
  })

  const paymentMethod = watch('paymentMethodType')
  const isSubmitting   = isCreatingCash || isCreatingCard

  const onSubmit = (values: CheckoutFormValues) => {
    if (!cart) return

    if (values.paymentMethodType === 'card') {
    
      createCardSession(cart._id)
    } else {
      createCashOrder({
        cartId: cart._id,
        dto: {
          shippingAddress: {
            details:    values.details,
            phone:      values.phone,
            city:       values.city,
            postalCode: values.postalCode,
          },
          paymentMethodType: 'cash',
        },
      })
    }
  }

  if (isCartLoading) return <CheckoutSkeleton />
  if (isEmpty)        return <EmptyCheckout locale={locale} />

  const totalPrice = cart?.totalPriceAfterDiscount ?? cart?.totalCartPrice ?? 0

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-text mb-8">
        {locale === 'ar' ? 'إتمام الطلب' : 'Checkout'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">

          {/* ── Left: Address + Payment ── */}
          <div className="space-y-6">

            {/* Shipping Address */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-bg p-6">
              <h2 className="font-bold text-text text-lg mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-brand" />
                {locale === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
              </h2>

              <div className="space-y-4">
                {/* Details */}
                <FormField
                  label={locale === 'ar' ? 'العنوان التفصيلي' : 'Address Details'}
                  icon={MapPin}
                  error={errors.details?.message}
                >
                  <textarea
                    {...register('details')}
                    rows={2}
                    placeholder={locale === 'ar' ? 'الشارع، رقم العمارة، الدور...' : 'Street, building, floor...'}
                    className={cn(
                      'w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none',
                      'border border-[var(--color-border)] bg-bg text-text',
                      'focus:border-brand transition-colors',
                      errors.details && 'border-red-400'
                    )}
                  />
                </FormField>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <FormField
                    label={locale === 'ar' ? 'رقم الهاتف' : 'Phone'}
                    icon={Phone}
                    error={errors.phone?.message}
                  >
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="01012345678"
                      className={cn(
                        'w-full h-11 px-3 rounded-xl text-sm outline-none',
                        'border border-[var(--color-border)] bg-bg text-text',
                        'focus:border-brand transition-colors',
                        errors.phone && 'border-red-400'
                      )}
                    />
                  </FormField>

                  {/* City */}
                  <FormField
                    label={locale === 'ar' ? 'المدينة' : 'City'}
                    icon={Building2}
                    error={errors.city?.message}
                  >
                    <input
                      {...register('city')}
                      type="text"
                      placeholder={locale === 'ar' ? 'القاهرة' : 'Cairo'}
                      className={cn(
                        'w-full h-11 px-3 rounded-xl text-sm outline-none',
                        'border border-[var(--color-border)] bg-bg text-text',
                        'focus:border-brand transition-colors',
                        errors.city && 'border-red-400'
                      )}
                    />
                  </FormField>
                </div>

                {/* Postal Code */}
                <FormField
                  label={locale === 'ar' ? 'الرمز البريدي (اختياري)' : 'Postal Code (optional)'}
                  icon={Hash}
                  error={errors.postalCode?.message}
                >
                  <input
                    {...register('postalCode')}
                    type="text"
                    placeholder="12345"
                    className={cn(
                      'w-full h-11 px-3 rounded-xl text-sm outline-none',
                      'border border-[var(--color-border)] bg-bg text-text',
                      'focus:border-brand transition-colors',
                      errors.postalCode && 'border-red-400'
                    )}
                  />
                </FormField>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-bg p-6">
              <h2 className="font-bold text-text text-lg mb-5 flex items-center gap-2">
                <CreditCard size={20} className="text-brand" />
                {locale === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                <PaymentOption
                  value="cash"
                  selected={paymentMethod === 'cash'}
                  icon={Banknote}
                  title={locale === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                  description={locale === 'ar' ? 'دفع نقدي عند توصيل الطلب' : 'Pay with cash upon delivery'}
                  register={register('paymentMethodType')}
                />
                <PaymentOption
                  value="card"
                  selected={paymentMethod === 'card'}
                  icon={CreditCard}
                  title={locale === 'ar' ? 'بطاقة ائتمانية' : 'Credit/Debit Card'}
                  description={locale === 'ar' ? 'دفع آمن عبر Stripe' : 'Secure payment via Stripe'}
                  register={register('paymentMethodType')}
                />
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-bg p-6">
              <h2 className="font-bold text-text text-lg mb-4">
                {locale === 'ar' ? `مراجعة الطلب (${cartItems.length})` : `Review Order (${cartItems.length})`}
              </h2>
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const product = typeof item.product === 'object'
                    ? (item.product as CartItemProduct)
                    : null
                  return (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-bg-secondary">
                        {product?.imageCover?.url ? (
                          <Image src={product.imageCover.url} alt={product.title} fill className="object-cover" sizes="48px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text line-clamp-1">{product?.title ?? '...'}</p>
                        <p className="text-xs text-text-muted">{item.quantity} × {item.price.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}</p>
                      </div>
                      <p className="text-sm font-bold text-text shrink-0">
                        {(item.price * item.quantity).toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div className="lg:sticky lg:top-24 space-y-4 self-start">
            <div className="rounded-2xl border border-[var(--color-border)] bg-bg p-6 space-y-3">
              <h2 className="font-bold text-text text-lg mb-2">
                {locale === 'ar' ? 'ملخص الدفع' : 'Payment Summary'}
              </h2>

              <div className="flex justify-between text-sm text-text-muted">
                <span>{locale === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{(cart?.totalCartPrice ?? 0).toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}</span>
              </div>

              {cart?.totalPriceAfterDiscount !== undefined && cart.totalPriceAfterDiscount < cart.totalCartPrice && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{locale === 'ar' ? 'الخصم' : 'Discount'}</span>
                  <span>-{(cart.totalCartPrice - cart.totalPriceAfterDiscount).toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-text-muted">
                <span>{locale === 'ar' ? 'الشحن' : 'Shipping'}</span>
                <span className="text-green-600">{locale === 'ar' ? 'مجاني' : 'Free'}</span>
              </div>

              <div className="h-px bg-[var(--color-border)]" />

              <div className="flex justify-between items-baseline">
                <span className="font-bold text-text">{locale === 'ar' ? 'الإجمالي' : 'Total'}</span>
                <span className="text-2xl font-black text-text">
                  {totalPrice.toLocaleString()} {locale === 'ar' ? 'ج.م' : 'EGP'}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-brand hover:bg-brand-dark text-white"
            >
              {isSubmitting
                ? (locale === 'ar' ? 'جاري التنفيذ...' : 'Processing...')
                : paymentMethod === 'card'
                  ? (locale === 'ar' ? 'الانتقال للدفع' : 'Proceed to Payment')
                  : (locale === 'ar' ? 'تأكيد الطلب' : 'Confirm Order')
              }
            </Button>

            <Link
              href="/cart"
              className="block text-center text-sm text-text-muted hover:text-brand transition-colors"
            >
              {locale === 'ar' ? 'الرجوع إلى السلة' : 'Back to Cart'}
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

// ============================================================
// FORM FIELD WRAPPER
// ============================================================
function FormField({
  label,
  icon: Icon,
  error,
  children,
}: {
  label:    string
  icon:     typeof MapPin
  error?:   string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-sm font-medium text-text mb-1.5 flex items-center gap-1.5">
        <Icon size={14} className="text-text-muted" />
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// ============================================================
// PAYMENT OPTION
// ============================================================
function PaymentOption({
  value,
  selected,
  icon: Icon,
  title,
  description,
  register,
}: {
  value:       string
  selected:    boolean
  icon:        typeof Banknote
  title:       string
  description: string
  register:    any
}) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all',
        selected
          ? 'border-brand bg-brand/5'
          : 'border-[var(--color-border)] hover:border-brand/40'
      )}
    >
      <input type="radio" value={value} {...register} className="sr-only" />
      <div className={cn(
        'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
        selected ? 'bg-brand text-white' : 'bg-bg-secondary text-text-muted'
      )}>
        <Icon size={16} />
      </div>
      <div>
        <p className={cn('text-sm font-semibold', selected ? 'text-brand' : 'text-text')}>{title}</p>
        <p className="text-xs text-text-muted mt-0.5">{description}</p>
      </div>
    </label>
  )
}

// ============================================================
// EMPTY STATE
// ============================================================
function EmptyCheckout({ locale }: { locale: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 rounded-full bg-bg-secondary flex items-center justify-center mb-6">
        <ShoppingBag size={40} className="text-text-muted" />
      </div>
      <h2 className="text-2xl font-bold text-text mb-2">
        {locale === 'ar' ? 'سلتك فاضية' : 'Your cart is empty'}
      </h2>
      <p className="text-text-muted mb-6">
        {locale === 'ar' ? 'أضف منتجات أولاً لإتمام الطلب' : 'Add products first to checkout'}
      </p>
      <Button  size="lg" className="bg-brand hover:bg-brand-dark text-white">
        <Link href="/products">
          {locale === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
        </Link>
      </Button>
    </div>
  )
}

// ============================================================
// SKELETON
// ============================================================
function CheckoutSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  )
}