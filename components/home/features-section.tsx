'use client'
import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export function FeaturesSection() {
  const t = useTranslations('home.features')

  const features = [
    {
      icon:    Truck,
      title:   t('freeShipping'),
      desc:    t('freeShippingDesc'),
      color:   'text-blue-500',
      bg:      'bg-blue-50 dark:bg-blue-950/30',
      border:  'border-blue-100 dark:border-blue-900/50',
    },
    {
      icon:    Shield,
      title:   t('securePay'),
      desc:    t('securePayDesc'),
      color:   'text-green-500',
      bg:      'bg-green-50 dark:bg-green-950/30',
      border:  'border-green-100 dark:border-green-900/50',
    },
    {
      icon:    RotateCcw,
      title:   t('freeReturn'),
      desc:    t('freeReturnDesc'),
      color:   'text-orange-500',
      bg:      'bg-orange-50 dark:bg-orange-950/30',
      border:  'border-orange-100 dark:border-orange-900/50',
    },
    {
      icon:    Headphones,
      title:   t('support'),
      desc:    t('supportDesc'),
      color:   'text-purple-500',
      bg:      'bg-purple-50 dark:bg-purple-950/30',
      border:  'border-purple-100 dark:border-purple-900/50',
    },
  ]

  return (
    <section className="py-16 bg-bg">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`
                rounded-2xl p-6 text-center card-hover
                border ${feature.border}
                bg-bg
              `}
            >
              <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="font-bold text-text mb-2">{feature.title}</h3>
              <p className="text-sm text-text-muted">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}