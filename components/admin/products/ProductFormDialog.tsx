'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale } from 'next-intl'
import toast from 'react-hot-toast'
import { Upload, X } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { productSchema, type ProductFormData } from '@/lib/validations/product'

import type { CreateProductDto, Product } from '@/types/product'
import type { Category } from '@/types/category'
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts'

interface Props {
  open:        boolean
  onOpenChange: (open: boolean) => void
  product:     Product | null
  categories:  Category[]
}

export default function ProductFormDialog({ open, onOpenChange, product, categories }: Props) {
  const locale = useLocale()
  const isRTL  = locale === 'ar'
  const isEdit = !!product

  const [imageCoverFile, setImageCoverFile] = useState<File | null>(null)
  const [imageCoverPreview, setImageCoverPreview] = useState<string | null>(null)
  const [imagesFiles, setImagesFiles] = useState<File[]>([])

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct()
  const isPending = isCreating || isUpdating

const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
  resolver: zodResolver(productSchema),
})

  useEffect(() => {
    if (open && product) {
      reset({
        title:              product.title,
        description:        product.description,
        quantity:            product.quantity,
        price:               product.price,
        priceAfterDiscount:  product.priceAfterDiscount,
        color:               product.color?.join(', '),
        category:            product.category?._id ?? '',
        brand:               product.brand?._id ?? '',
        status:              (product.status as any) ?? 'ACTIVE',
        isFeatured:          product.isFeatured ?? false,
      })
      setImageCoverPreview(product.imageCover?.url ?? null)
    } else if (open && !product) {
      reset({
        title: '', description: '', price: undefined, quantity: undefined,
        priceAfterDiscount: undefined, color: '', category: '', brand: '',
        status: 'ACTIVE', isFeatured: false,
      })
      setImageCoverPreview(null)
      setImageCoverFile(null)
      setImagesFiles([])
    }
  }, [open, product, reset])

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageCoverFile(file)
    setImageCoverPreview(URL.createObjectURL(file))
  }

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setImagesFiles((prev) => [...prev, ...files].slice(0, 10))
  }

 const onSubmit = (formData: ProductFormData) => {
    if (isEdit && product) {

     const payload: Record<string, any> = {
  title:              formData.title,
  description:        formData.description || undefined,
  quantity:            Number(formData.quantity),
  price:               Number(formData.price),
  priceAfterDiscount:  formData.priceAfterDiscount != null ? Number(formData.priceAfterDiscount) : undefined,
  category:            formData.category,
  brand:               formData.brand || undefined,
  status:              formData.status,
  isFeatured:          formData.isFeatured,
}
      if (formData.color) {
        payload.color = formData.color.split(',').map(c => c.trim()).filter(Boolean)
      }

      updateProduct({ id: product._id, dto: payload }, {
        onSuccess: () => {
          toast.success(isRTL ? 'تم تحديث المنتج' : 'Product updated')
          onOpenChange(false)
        },
        onError: () => toast.error(isRTL ? 'فشل التحديث' : 'Update failed'),
      })
    } else {

      if (!imageCoverFile) {
        toast.error(isRTL ? 'صورة الغلاف مطلوبة' : 'Cover image is required')
        return
      }

const dto: CreateProductDto = {
  title:       formData.title,
  description: formData.description || '',
  price:       Number(formData.price),
  quantity:    Number(formData.quantity ?? 1),
  category:    formData.category,
  imageCover:  imageCoverFile,
}

if (formData.priceAfterDiscount != null) dto.priceAfterDiscount = Number(formData.priceAfterDiscount)
if (formData.color)    dto.color    = formData.color
if (formData.brand)    dto.brand    = formData.brand
if (formData.status)   dto.status   = formData.status
if (formData.isFeatured != null) dto.isFeatured = formData.isFeatured
if (imagesFiles.length > 0) dto.images = imagesFiles

      createProduct(dto, {
        onSuccess: () => {
          toast.success(isRTL ? 'تم إضافة المنتج' : 'Product created')
          onOpenChange(false)
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message
          toast.error(Array.isArray(msg) ? msg[0] : msg || (isRTL ? 'فشلت العملية' : 'Operation failed'))
        },
      })
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? (isRTL ? 'تعديل المنتج' : 'Edit Product') : (isRTL ? 'إضافة منتج جديد' : 'Add New Product')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

         
          {!isEdit && (
            <div className="space-y-1.5">
              <label className="text-sm text-text-muted block">{isRTL ? 'صورة الغلاف *' : 'Cover Image *'}</label>
              <label className="flex items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-[var(--color-border)] cursor-pointer hover:border-brand transition-colors overflow-hidden relative">
                {imageCoverPreview ? (
                  <Image src={imageCoverPreview} alt="cover" fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-text-muted">
                    <Upload size={20} />
                    <span className="text-xs">{isRTL ? 'اختر صورة' : 'Choose image'}</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              </label>
            </div>
          )}

          {isEdit && product?.imageCover?.url && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <Image src={product.imageCover.url} alt={product.title} fill className="object-cover" />
              </div>
              <p className="text-xs text-text-muted">{isRTL ? 'لتغيير الصور يرجى استخدام إدارة الصور (قريباً)' : 'Image editing coming soon'}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm text-text-muted block">{isRTL ? 'اسم المنتج' : 'Title'}</label>
            <input
              {...register('title')}
              className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm text-text-muted block">{isRTL ? 'الوصف' : 'Description'}</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand resize-none"
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-text-muted block">{isRTL ? 'السعر' : 'Price'}</label>
              <input
                type="number" {...register('price')}
                className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-text-muted block">{isRTL ? 'السعر بعد الخصم' : 'Price After Discount'}</label>
              <input
                type="number" {...register('priceAfterDiscount')}
                className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-text-muted block">{isRTL ? 'الكمية' : 'Quantity'}</label>
              <input
                type="number" {...register('quantity')}
                className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-text-muted block">{isRTL ? 'الألوان (مفصولة بفاصلة)' : 'Colors (comma separated)'}</label>
              <input
                {...register('color')}
                placeholder="Black, White, Red"
                className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-text-muted block">{isRTL ? 'الفئة' : 'Category'}</label>
            <select
              {...register('category')}
              className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
            >
              <option value="">{isRTL ? 'اختر الفئة' : 'Select category'}</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-text-muted block">{isRTL ? 'الحالة' : 'Status'}</label>
              <select
                {...register('status')}
                className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="DRAFT">DRAFT</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" {...register('isFeatured')} id="isFeatured" className="w-4 h-4" />
              <label htmlFor="isFeatured" className="text-sm text-text">{isRTL ? 'منتج مميز' : 'Featured product'}</label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" isLoading={isPending} className="bg-brand hover:bg-brand-dark text-white">
              {isEdit ? (isRTL ? 'حفظ التغييرات' : 'Save Changes') : (isRTL ? 'إضافة المنتج' : 'Add Product')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}