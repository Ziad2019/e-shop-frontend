'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-lg cursor-pointer
                 bg-gray-100 dark:bg-gray-800
                 text-gray-800 dark:text-gray-100
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 transition-colors"
    >
      {isDark ? '☀️ فاتح' : '🌙 داكن'}
    </button>
  )
}