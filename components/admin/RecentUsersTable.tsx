'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { RecentUser } from '@/types/dashboard'

interface Props {
  users:     RecentUser[]
  isLoading: boolean
}

export default function RecentUsersTable({ users, isLoading }: Props) {
  const locale = useLocale()
  const isRTL  = locale === 'ar'

  return (
    <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text">
          {isRTL ? 'أحدث المستخدمين' : 'Recently Registered Users'}
        </h3>
        <Link
          href="/admin/users"
          className="flex items-center gap-1 text-xs text-brand hover:text-brand-dark font-medium"
        >
          {isRTL ? 'عرض الكل' : 'View all'}
          {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
        </Link>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : users.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">
          {isRTL ? 'لا يوجد مستخدمين' : 'No users found'}
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {users.map((u) => (
            <Link
              key={u._id}
              href={`/admin/users/${u._id}`}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] hover:bg-bg-secondary transition-colors"
            >
              <div className="relative w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0 overflow-hidden">
                {u.avatar ? (
                  <Image src={u.avatar} alt={u.name} fill className="object-cover" />
                ) : (
                  <span className="text-brand font-bold text-sm">{u.name?.slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text truncate">{u.name}</p>
                <p className="text-xs text-text-muted truncate">{u.email}</p>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  'text-[10px] shrink-0',
                  u.role === 'admin' && 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
                )}
              >
                {u.role === 'admin' ? (isRTL ? 'أدمن' : 'Admin') : (isRTL ? 'مستخدم' : 'User')}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}