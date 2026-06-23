'use client'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'

export default function LanguageSwitcher({
  currentLocale,
}: {
  currentLocale: string
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const toggleLang = () => {
    const next = currentLocale === 'ar' ? 'en' : 'ar'
    document.cookie = `locale=${next}; path=/; max-age=31536000`
    startTransition(() => router.refresh())
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLang}
      disabled={isPending}
      className="gap-1.5 text-text-muted hover:text-brand"
    >
      <Languages size={15} />
      {currentLocale === 'ar' ? 'EN' : 'AR'}
    </Button>
  )
}