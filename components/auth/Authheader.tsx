'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'
import { Sun, Moon, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { cn } from '@/lib/utils'

interface Props {
  showBackToHome?: boolean
}

export default function AuthHeader({ showBackToHome = true }: Props) {
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const isRTL  = locale === 'ar'
  const [mounted, setMounted] = useState(false)
  const isDark = theme === 'dark'

  // mount check to avoid hydration mismatch on theme icon
  useState(() => setMounted(true))

  const BackIcon = isRTL ? ArrowRight : ArrowLeft

  return (
    <div className="absolute top-4 inset-x-0 flex items-center justify-between px-4 sm:px-6 z-10">

      {/* Back to home */}
      {showBackToHome ? (
        <Link
          href="/"
          className={cn(
            'flex items-center gap-1.5 text-sm font-medium text-text-muted',
            'hover:text-brand transition-colors'
          )}
        >
          <BackIcon size={16} />
          {locale === 'ar' ? 'الرئيسية' : 'Home'}
        </Link>
      ) : <span />}

      {/* Theme + Language */}
      <div className="flex items-center gap-1.5">
        <LanguageSwitcher currentLocale={locale} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={isRTL ? 'تغيير المظهر' : 'Toggle theme'}
          className="text-text-muted hover:text-brand"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
    </div>
  )
}