"use client"
import { CheckCircle, Eye, EyeOff, Lock, Mail, Router, ShoppingBagIcon, User } from 'lucide-react'
import Link from 'next/link'
import { motion } from "framer-motion"
import { Button } from '../ui/button'
import { RegisterFormData, registerSchema } from '@/lib/validations/auth'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '../ui/input'
import { useState } from 'react'
import { getMe, signup } from '@/lib/api/auth'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'


const Register = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const router = useRouter()
    const setAuth = useAuthStore((state) => state.setAuth)


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })
    const password = watch("password", "")

    const passwordStrength = (() => {
        let score = 0
        if (password.length >= 6) score++
        if (password.length >= 10) score++
        if (/[A-Z]/.test(password)) score++
        if (/[0-9]/.test(password)) score++
        if (/[^A-Za-z0-9]/.test(password)) score++
        return score
    })()

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Excellent"]
    const strengthColor = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"]


    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null)
        try {
            const { confirmPassword, ...dto } = data
            const response = await signup(dto)
           
            const user = await getMe(response.access_token)

            setAuth(user, response.access_token)
            toast.success('Account created successfully')
            router.push('/')
        } catch (error: any) {
            const status = error?.response?.status
            if (status === 409) {
                setServerError('Email already exists')
                toast.error('Email already exists')
            } else {
                toast.error('An error occurred')
            }
        }
    }
    const handleGoogleRegister = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
    }
    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
        >
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                {/*Logo  */}
                <Link href="/" className="flex items-center justify-center mb-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-12 h-12 rounded-md flex items-center justify-center">
                        <ShoppingBagIcon className="w-8 h-8 text-white" />
                    </div>
                </Link>
                <div className="flex flex-col space-y-1">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Create an Account</h2>
                    <p className="text-gray-600 text-center">Join us and start shopping today</p>
                </div>
                {/* Google Register */}
                <form className="mt-6">
                    <Button type="button" variant="outline" className="w-full h-12 mb-6" size="lg" onClick={handleGoogleRegister}>
                        <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Register with Google
                    </Button>
                </form>
                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-400">or</span>
                    </div>
                </div>
                {/* Form Fields */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="ltr">
                    <Input
                        label="Full Name"
                        type="text"
                        {...register("name")}
                        placeholder="Enter your name"
                        icon={<User className="w-5 h-5" />}
                        error={errors.name?.message} />
                    <Input
                        label="Email"
                        type="email"
                        {...register("email")}
                        placeholder="Enter your email"
                        icon={<Mail className="w-5 h-5" />}
                        error={errors.email?.message} />

                    <div>
                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                error={errors.password?.message}
                                {...register("password")}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                        {/* Password Strength Indicator */}
                        {password && (
                            <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 flex-1 rounded-full transition-all ${i < passwordStrength ? strengthColor[passwordStrength] : "bg-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs ${passwordStrength >= 4 ? "text-green-600" : passwordStrength >= 3 ? "text-yellow-600" : "text-red-500"}`}>
                                    Password strength  : {strengthLabel[passwordStrength]}
                                </p>

                            </div>

                        )}
                    </div>
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock className="w-5 h-5" />}
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />
                    {/* Terms */}
                    <label className="flex items-start gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            required
                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                        />
                        <span className="text-sm text-gray-800">
                            I agree to the{" "}
                            <Link href="/terms" className="text-indigo-600 hover:underline">Terms and Conditions</Link>
                            {" "}and{" "}
                            <Link href="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
                        </span>
                    </label>
                    <Button
                        type="submit"
                        isLoading={isSubmitting}
                        variant="gradient"
                        size="lg"
                        className="w-full"
                    >
                        Create Account
                    </Button>
                </form>
                {/* Features */}
                <div className="mt-6 space-y-2" dir="ltr">
                    {["Free shipping on first order", "Exclusive discounts for members", "Track your orders easily"].map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {feature}
                        </div>
                    ))}
                </div>

                {/* Login Link */}
                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                        Log in
                    </Link>
                </p>
            </div>
        </motion.div>
    )
}

export default Register