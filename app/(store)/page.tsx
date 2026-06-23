

import CategoriesProductsSection from '@/components/home/CategoriesSection'
import CategoriesSection from '@/components/home/CategoriesSection'

import { DealsSection } from '@/components/home/deals-section'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { FeaturesSection } from '@/components/home/features-section'

import { HeroSection } from '@/components/home/HeroSection'
import { NewArrivalProducts } from '@/components/home/NewArrivalProducts'
import { TestimonialsSection } from '@/components/home/testimonials-section'




const HomePage = () => {

  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <DealsSection />
      <NewArrivalProducts />
      <FeaturesSection />
      <TestimonialsSection />
    </main>
  )
}

export default HomePage