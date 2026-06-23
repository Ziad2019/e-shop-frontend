'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface CartDrawerContextType {
  isOpen:  boolean
  open:    () => void
  close:   () => void
  toggle:  () => void
}

const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined)

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open   = () => setIsOpen(true)
  const close  = () => setIsOpen(false)
  const toggle = () => setIsOpen((v) => !v)

  return (
    <CartDrawerContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </CartDrawerContext.Provider>
  )
}

export function useCartDrawer() {
  const ctx = useContext(CartDrawerContext)
  if (!ctx) {
    throw new Error('useCartDrawer must be used within CartDrawerProvider')
  }
  return ctx
}