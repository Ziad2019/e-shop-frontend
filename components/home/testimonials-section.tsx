'use client'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'

const testimonials = [
  {
    id:     1,
    name:   'أحمد محمد',
    nameEn: 'Ahmed Mohamed',
    year:   '2023',
    rating: 5,
    textAr: 'تجربة تسوق ممتازة! المنتجات أصلية والتوصيل سريع جداً. أنصح الجميع بالشراء من هنا.',
    textEn: 'Excellent shopping experience! Products are genuine and delivery is very fast. I recommend everyone to shop here.',
  },
  {
    id:     2,
    name:   'سارة عبدالله',
    nameEn: 'Sarah Abdullah',
    year:   '2024',
    rating: 5,
    textAr: 'أفضل متجر إلكتروني تعاملت معه. خدمة العملاء ممتازة والأسعار تنافسية جداً.',
    textEn: 'Best online store I have dealt with. Customer service is excellent and prices are very competitive.',
  },
  {
    id:     3,
    name:   'محمد خالد',
    nameEn: 'Mohamed Khaled',
    year:   '2023',
    rating: 4,
    textAr: 'منتجات عالية الجودة وتغليف ممتاز. استلمت طلبي في يومين فقط. شكراً لكم!',
    textEn: 'High quality products and excellent packaging. I received my order in just two days. Thank you!',
  },
]

export function TestimonialsSection() {
  const t      = useTranslations('home.testimonials')
  const locale = useLocale() as 'ar' | 'en' 

  return (
    <section className="py-16 bg-bg-secondary">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-3">
            {t('title')}
          </h2>
          <p className="text-text-muted text-lg">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-bg rounded-2xl border border-[var(--color-border)] p-6 card-hover relative"
            >
              <Quote className="w-10 h-10 text-brand/20 absolute top-6 end-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < item.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-text-muted leading-relaxed mb-6 relative z-10">
                "{locale === 'ar' ? item.textAr : item.textEn}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">
                    {(locale === 'ar' ? item.name : item.nameEn).charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-text text-sm">
                    {locale === 'ar' ? item.name : item.nameEn}
                  </p>
                  <p className="text-xs text-text-muted">
                    {t('since')} {item.year}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}