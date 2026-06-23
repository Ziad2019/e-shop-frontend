'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

const slidesMeta = [
  {
    id: 1,
    color: 'from-indigo-600 to-purple-700',
    link: '/products?category=fashion',
  },
  {
    id: 2,
    color: 'from-blue-600 to-cyan-600',
    link: '/products?category=electronics',
  },
  {
    id: 3,
    color: 'from-emerald-600 to-teal-600',
    link: '/products?category=home',
  },
]

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const t = useTranslations('hero')
  const locale = useLocale()
  const isRTL = locale === 'ar'

  // Enhance slides with translated content
  const slides = slidesMeta.map((meta, i) => ({
    ...meta,
    title: t(`slides.${i}.title`),
    subtitle: t(`slides.${i}.subtitle`),
    description: t(`slides.${i}.description`),
  }))

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const goNext = () => setCurrent((prev) => (prev + 1) % slides.length)
  const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7 }}
          className={cn(
            'absolute inset-0 bg-gradient-to-br',
            slides[current].color
          )}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="container-custom h-full flex items-center relative z-10">
            <div className="max-w-2xl">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-6"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">
                  {slides[current].subtitle}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight"
              >
                {slides[current].title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-white/80 mb-8 max-w-lg"
              >
                {slides[current].description}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 flex-wrap"
              >
                <Button
                  size="xl"

                  className=" bg-white text-gray-900 hover:bg-gray-100 shadow-2xl group "
                >
                  <Link href={slides[current].link} className='text-gray-900 flex flex-row'>
                    {t('shopNow')}{isRTL
                      ? <ArrowLeft className="w-5 h-5 ms-2 group-hover:-translate-x-1 transition-transform mt-1.5" />
                      : <ArrowRight className="w-5 h-5 ms-2 group-hover:translate-x-1 transition-transform mt-1.5" />
                    }
                  </Link>
                </Button>

                <Button
                  size="xl"
                  variant="ghost"

                  className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/products" className='text-white'>
                    {t('allProducts')}
                  </Link>
                </Button>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation Arrows ── */}
      <button
        onClick={isRTL ? goNext : goPrev}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-20',
          'w-10 h-10 rounded-full',
          'bg-white/20 hover:bg-white/30 backdrop-blur',
          'flex items-center justify-center',
          'transition-colors',
          isRTL ? 'right-4' : 'left-4'
        )}
        aria-label={isRTL ? 'التالي' : 'Previous'}
      >
        {isRTL ? <ArrowRight className="w-5 h-5 text-white" /> : <ArrowLeft className="w-5 h-5 text-white" />}
      </button>

      <button
        onClick={isRTL ? goPrev : goNext}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-20',
          'w-10 h-10 rounded-full',
          'bg-white/20 hover:bg-white/30 backdrop-blur',
          'flex items-center justify-center',
          'transition-colors',
          isRTL ? 'left-4' : 'right-4'
        )}
        aria-label={isRTL ? 'السابق' : 'Next'}
      >
        {isRTL ? <ArrowLeft className="w-5 h-5 text-white" /> : <ArrowRight className="w-5 h-5 text-white" />}
      </button>

      <button
        onClick={isRTL ? goPrev : goNext}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 z-20',
          'w-10 h-10 rounded-full',
          'bg-white/20 hover:bg-white/30 backdrop-blur',
          'flex items-center justify-center',
          'transition-colors',
          isRTL ? 'left-4' : 'right-4'
        )}
        aria-label="التالي"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {/* ── Indicators ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === current
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/70'
            )}
            aria-label={`الشريحة ${index + 1}`}
          />
        ))}
      </div>

    </section>
  )
}