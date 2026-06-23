'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { getMe } from '@/lib/api/auth'

export default function CallbackPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const setAuth      = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      router.push('/register')
      return
    }

    getMe(token)
      .then((user) => {
        setAuth(user, token)
        router.push('/')
      })
      .catch(() => {
        router.push('/register')
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">جاري تسجيل الدخول...</p>
      </div>
    </div>
  )
}