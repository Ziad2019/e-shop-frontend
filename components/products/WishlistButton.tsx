'use client'
import { Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import {
  useIsInWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/hooks/useWishlist'

interface Props {
  productId:  string
  className?: string
  size?:      number
}

export default function WishlistButton({ productId, className, size = 16 }: Props) {
  const router  = useRouter()
  const locale  = useLocale()
  const isAuth  = useAuthStore((state) => !!state.accessToken)

  const isWishlisted = useIsInWishlist(productId)
  const { mutate: addItem,    isPending: isAdding   } = useAddToWishlist()
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromWishlist()

  const isPending = isAdding || isRemoving

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuth) {
      toast.error(locale === 'ar' ? 'سجل دخولك أولاً' : 'Please login first')
      router.push('/login')
      return
    }

    if (isWishlisted) {
      removeItem(productId, {
        onSuccess: () => toast.success(locale === 'ar' ? 'تم الحذف من المفضلة' : 'Removed from wishlist'),
        onError:   () => toast.error(locale === 'ar' ? 'حدث خطأ' : 'Something went wrong'),
      })
    } else {
      addItem(productId, {
        onSuccess: () => toast.success(locale === 'ar' ? 'تم الإضافة للمفضلة' : 'Added to wishlist'),
        onError:   () => toast.error(locale === 'ar' ? 'حدث خطأ' : 'Something went wrong'),
      })
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'transition-all duration-200',
        isPending && 'opacity-50 cursor-not-allowed',
        className,
      )}
      aria-label={locale === 'ar' ? 'المفضلة' : 'Wishlist'}
    >
      <Heart
        size={size}
        className={cn(
          'transition-colors',
          isWishlisted ? 'fill-red-500 text-red-500' : 'text-text-muted',
        )}
      />
    </button>
  )
}