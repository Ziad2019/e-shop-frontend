'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user    = useAuthStore((state) => state.user)
  const token   = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (!token) {
      router.replace('/login')
      return
    }
    if (user && user.role !== 'admin') {
      router.replace('/')
    }
  }, [user, token, router])

  if (!token || (user && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}