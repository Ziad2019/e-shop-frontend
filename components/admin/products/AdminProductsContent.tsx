'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { useDebouncedCallback } from 'use-debounce'
import { Plus, Search, Edit2, Trash2, Star, ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { useCategories } from '@/hooks/useCategories'

import ConfirmDeleteDialog from '../shared/ConfirmDeleteDialog'
import toast from 'react-hot-toast'
import type { Product } from '@/types/product'
import { useAdminProducts } from '@/lib/api/useAdminProducts'
import { useDeleteProduct } from '@/hooks/useProducts'
import ProductFormDialog from './ProductFormDialog'

export default function AdminProductsContent() {
  const locale = useLocale()
  const isRTL  = locale === 'ar'

  const [page, setPage]         = useState(1)
  const [keyword, setKeyword]   = useState('')
  const [category, setCategory] = useState('')

  const [formOpen, setFormOpen]             = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget]     = useState<Product | null>(null)

  const { data, isLoading } = useAdminProducts({
    page, limit: 10, keyword: keyword || undefined,
    category: category || undefined,
  })
  const { data: categoriesRes } = useCategories()
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setKeyword(value)
    setPage(1)
  }, 400)

  const products   = data?.data ?? []
  const totalPages = data?.pages ?? 1
  const total      = data?.total ?? data?.length ?? 0
  const categories = categoriesRes?.data ?? []

  const openCreate = () => { setEditingProduct(null); setFormOpen(true) }
  const openEdit   = (p: Product) => { setEditingProduct(p); setFormOpen(true) }

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteProduct(deleteTarget._id, {
      onSuccess: () => {
        toast.success(isRTL ? 'تم حذف المنتج' : 'Product deleted')
        setDeleteTarget(null)
      },
      onError: () => toast.error(isRTL ? 'فشل الحذف' : 'Delete failed'),
    })
  }

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">{isRTL ? 'المنتجات' : 'Products'}</h1>
          <p className="text-text-muted text-sm mt-1">{total} {isRTL ? 'منتج' : 'products'}</p>
        </div>
        <Button onClick={openCreate} className="bg-brand hover:bg-brand-dark text-white gap-2">
          <Plus size={16} />
          {isRTL ? 'إضافة منتج' : 'Add Product'}
        </Button>
      </div>

      <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={isRTL ? 'بحث عن منتج...' : 'Search products...'}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full h-10 ps-10 pe-4 rounded-xl text-sm outline-none border border-[var(--color-border)] bg-bg-secondary text-text focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1) }}
          className="h-10 px-3 rounded-xl border border-[var(--color-border)] bg-bg-secondary text-text text-sm outline-none"
        >
          <option value="">{isRTL ? 'كل الفئات' : 'All Categories'}</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-bg rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-bg-secondary">
                <th className="text-start px-4 py-3 font-medium text-text-muted">{isRTL ? 'المنتج' : 'Product'}</th>
                <th className="text-start px-4 py-3 font-medium text-text-muted">{isRTL ? 'الفئة' : 'Category'}</th>
                <th className="text-start px-4 py-3 font-medium text-text-muted">{isRTL ? 'السعر' : 'Price'}</th>
                <th className="text-start px-4 py-3 font-medium text-text-muted">{isRTL ? 'المخزون' : 'Stock'}</th>
                <th className="text-start px-4 py-3 font-medium text-text-muted">{isRTL ? 'التقييم' : 'Rating'}</th>
                <th className="text-start px-4 py-3 font-medium text-text-muted">{isRTL ? 'الحالة' : 'Status'}</th>
                <th className="text-end px-4 py-3 font-medium text-text-muted">{isRTL ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)]">
                    <td className="px-4 py-3" colSpan={7}><Skeleton className="h-10 w-full" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Package size={32} className="mx-auto text-text-muted mb-2" />
                    <p className="text-text-muted text-sm">{isRTL ? 'لا توجد منتجات' : 'No products found'}</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-[var(--color-border)] hover:bg-bg-secondary transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-bg-secondary overflow-hidden shrink-0">
                          {product.imageCover?.url && (
                            <Image src={product.imageCover.url} alt={product.title} fill className="object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-text line-clamp-1 max-w-[200px]">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{product.category?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-text font-medium">{product.price?.toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}</td>
                    <td className="px-4 py-3">
                      <span className={cn(product.quantity <= 10 && 'text-destructive font-medium')}>{product.quantity}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star size={13} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-text-muted">{product.ratingsAverage?.toFixed(1) ?? '0.0'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-[10px]',
                          product.status === 'ACTIVE'   && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
                          product.status === 'DRAFT'    && 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
                          product.status === 'ARCHIVED' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
                        )}
                      >
                        {product.status ?? 'ACTIVE'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-bg text-text-muted hover:text-brand transition-colors">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(product)} className="p-2 rounded-lg hover:bg-bg text-text-muted hover:text-destructive transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-[var(--color-border)]">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-bg-secondary disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-sm text-text-muted px-3">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-bg-secondary disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}
      </div>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        categories={categories}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title={isRTL ? 'حذف المنتج' : 'Delete Product'}
        description={isRTL
          ? `هل أنت متأكد من حذف "${deleteTarget?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
          : `Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`
        }
      />
    </div>
  )
}