import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCartDrawer } from '../cart/CartDrawerContext'
import { useAddToCart } from '@/hooks/useCarts'
import { useLocale, useTranslations } from 'next-intl'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


interface IProps {
    isOutOfStock: boolean,
    productId: string

}
const AddCartButton = ({ isOutOfStock, productId, }: IProps) => {
     const router  = useRouter()
      const locale  = useLocale()
    const t = useTranslations('products')
    const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart()
    const { open: openCartDrawer } = useCartDrawer()
    const isAuth  = useAuthStore((state) => !!state.accessToken)

      const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuth) {
      toast.error(locale === 'ar' ? 'سجل دخولك أولاً' : 'Please login first')
      router.push('/login')
      return
    }
  
     addToCart(
                { productId: productId },
                { onSuccess: () => openCartDrawer() }
            )

  }
    return (
        <Button
            size="sm"
            disabled={isOutOfStock}
            className={cn(
                'shrink-0 gap-1.5',
                isOutOfStock
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-brand hover:bg-brand-dark text-white'
            )}
            onClick={handleClick}
        >
            <ShoppingCart size={14} />
            <span className="hidden sm:block">{t('addToCart')}</span>
        </Button>
    )
}

export default AddCartButton