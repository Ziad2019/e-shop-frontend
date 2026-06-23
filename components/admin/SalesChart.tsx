'use client'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { useSalesStats } from '@/hooks/useDashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const periods = [
  { value: 'daily',   labelAr: 'يومي',  labelEn: 'Daily'   },
  { value: 'monthly', labelAr: 'شهري',  labelEn: 'Monthly' },
  { value: 'yearly',  labelAr: 'سنوي',  labelEn: 'Yearly'  },
]

export default function SalesChart() {
  const locale = useLocale()
  const isRTL  = locale === 'ar'
  const [period, setPeriod] = useState('monthly')

  const { data, isLoading } = useSalesStats(period)
  const chart = data?.data?.chart ?? []

  return (
    <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-text">
            {isRTL ? 'تحليل المبيعات' : 'Sales Analytics'}
          </h3>
          <p className="text-sm text-text-muted mt-0.5">
            {isRTL ? 'إجمالي الإيرادات' : 'Total revenue'}: {(data?.data?.totalRevenue ?? 0).toLocaleString()} {isRTL ? 'ج.م' : 'EGP'}
          </p>
        </div>
        <div className="flex gap-1 bg-bg-secondary rounded-xl p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                period === p.value ? 'bg-brand text-white' : 'text-text-muted hover:text-text'
              )}
            >
              {isRTL ? p.labelAr : p.labelEn}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-72 w-full rounded-xl" />
      ) : chart.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-text-muted text-sm">
          {isRTL ? 'لا توجد بيانات لعرضها' : 'No data to display'}
        </div>
      ) : (
        <div className="h-72" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="period" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  fontSize: '13px',
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}