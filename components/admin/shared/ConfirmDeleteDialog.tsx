'use client'
import { AlertTriangle } from 'lucide-react'
import { useLocale } from 'next-intl'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open:        boolean
  onOpenChange: (open: boolean) => void
  onConfirm:   () => void
  isLoading?:  boolean
  title:       string
  description: string
}

export default function ConfirmDeleteDialog({
  open, onOpenChange, onConfirm, isLoading, title, description,
}: Props) {
  const locale = useLocale()
  const isRTL  = locale === 'ar'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <AlertTriangle size={22} className="text-destructive" />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-start">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button variant="destructive" onClick={onConfirm} isLoading={isLoading}>
            {isRTL ? 'حذف' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}