'use client'
import Link from 'next/link'
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'

// ── Social Icons ──────────────────────────────────
const FacebookIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
const TwitterIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
const InstagramIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
const YoutubeIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>

const socials = [
    { Icon: FacebookIcon, href: '#', label: 'Facebook' },
    { Icon: TwitterIcon, href: '#', label: 'Twitter' },
    { Icon: InstagramIcon, href: '#', label: 'Instagram' },
    { Icon: YoutubeIcon, href: '#', label: 'YouTube' },
]

export function Footer() {
    const locale = useLocale()
    const isRTL = locale === 'ar'
    const [email, setEmail] = useState('')

    const quickLinks = [
        { label: isRTL ? 'الرئيسية' : 'Home', href: '/' },
        { label: isRTL ? 'المنتجات' : 'Products', href: '/products' },
        { label: isRTL ? 'التصنيفات' : 'Categories', href: '/categories' },
        { label: isRTL ? 'العروض' : 'Deals', href: '/products?featured=true' },
        { label: isRTL ? 'من نحن' : 'About Us', href: '/about' },
        { label: isRTL ? 'تواصل معنا' : 'Contact', href: '/contact' },
    ]

    const customerLinks = [
        { label: isRTL ? 'حسابي' : 'My Account', href: '/profile' },
        { label: isRTL ? 'طلباتي' : 'My Orders', href: '/orders' },
        { label: isRTL ? 'سياسة الإرجاع' : 'Return Policy', href: '/return-policy' },
        { label: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy', href: '/privacy-policy' },
        { label: isRTL ? 'الشروط والأحكام' : 'Terms', href: '/terms' },
        { label: isRTL ? 'الأسئلة الشائعة' : 'FAQ', href: '/faq' },
    ]

    return (
        <footer className="bg-gray-950 text-gray-400">

            {/* ── Newsletter ── */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="container-custom py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white">
                                {isRTL ? 'اشترك في نشرتنا البريدية' : 'Subscribe to Our Newsletter'}
                            </h3>
                            <p className="text-indigo-100 mt-1">
                                {isRTL ? 'احصل على أحدث العروض والخصومات' : 'Get the latest offers and discounts'}
                            </p>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={isRTL ? 'بريدك الإلكتروني...' : 'Your email...'}
                                className={`
                  flex-1 md:w-80 h-12 px-5
                  ${isRTL ? 'rounded-r-xl' : 'rounded-l-xl'}
                  bg-white/10 backdrop-blur
                  border border-white/20
                  text-white placeholder:text-indigo-200
                  outline-none focus:bg-white/20
                `}
                            />
                            <button className={`
                h-12 px-8 bg-white text-indigo-600 font-bold
                ${isRTL ? 'rounded-l-xl' : 'rounded-r-xl'}
                hover:bg-indigo-50 transition-colors
              `}>
                                {isRTL ? 'اشترك' : 'Subscribe'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Footer ── */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">E-Shop</span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            {isRTL
                                ? 'متجرك الإلكتروني الموثوق. نقدم لك أفضل المنتجات بأفضل الأسعار مع خدمة توصيل سريعة وآمنة.'
                                : 'Your trusted online store. We offer you the best products at the best prices with fast and secure delivery.'
                            }
                        </p>
                        <div className="flex gap-3">
                            {socials.map(({ Icon, href, label }) => (
                                <a                        
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-all duration-300 text-gray-400 hover:text-white"
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">
                            {isRTL ? 'روابط سريعة' : 'Quick Links'}
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`hover:text-indigo-400 transition-all duration-300 ${isRTL ? 'hover:pr-2' : 'hover:pl-2'}`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">
                            {isRTL ? 'خدمة العملاء' : 'Customer Service'}
                        </h4>
                        <ul className="space-y-3">
                            {customerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`hover:text-indigo-400 transition-all duration-300 ${isRTL ? 'hover:pr-2' : 'hover:pl-2'}`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6">
                            {isRTL ? 'تواصل معنا' : 'Contact Us'}
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                                <span>{isRTL ? 'القاهرة، مصر - شارع التحرير' : 'Cairo, Egypt - Tahrir Street'}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span dir="ltr">+20 123 456 7890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                                <span>info@e-shop.com</span>
                            </li>
                        </ul>

                        {/* Payment Methods */}
                        <div className="mt-6">
                            <h5 className="text-white font-medium mb-3">
                                {isRTL ? 'طرق الدفع' : 'Payment Methods'}
                            </h5>
                            <div className="flex gap-2 flex-wrap">
                                {['VISA', 'MC', 'AMEX', 'PayPal'].map((m) => (
                                    <div
                                        key={m}
                                        className="w-14 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-700"
                                    >
                                        {m}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Copyright ── */}
            <div className="border-t border-gray-800 text-center">
                <div className="container-custom py-6 ">
                    <p className="text-gray-500 text-sm">
                       
                        {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
                         © {new Date().getFullYear()} E-Shop.{' '}
                    </p>
                    {/* <p className="text-gray-500 text-sm">
                        {isRTL ? 'صنع بـ' : 'Made with'} ❤️ {isRTL ? 'باستخدام Next.js' : 'using Next.js'}
                    </p> */}
                </div>
            </div>

        </footer>
    )
}