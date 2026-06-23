import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
  label:      string
  value:      string | number
  icon:       LucideIcon
  trend?:     { value: number; isUp: boolean }
  iconBg:     string
  iconColor:  string
}

export default function StatCard({ label, value, icon: Icon, trend, iconBg, iconColor }: Props) {
  return (
    <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex items-center justify-between mb-6">
        {trend && (
          <span className={cn(
            'flex items-center gap-1 text-xs font-semibold',
            trend.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
          )}>
            {trend.value}%
            {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          </span>
        )}
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center ms-auto', iconBg)}>
          <Icon size={19} className={iconColor} />
        </div>
      </div>
      <p className="text-2xl font-bold text-text">{value}</p>
      <p className="text-sm text-text-muted mt-1">{label}</p>
    </div>
  )
}