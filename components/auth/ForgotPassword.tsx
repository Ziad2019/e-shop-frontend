"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { Mail, Lock, ShoppingBagIcon, ArrowLeft, KeyRound } from "lucide-react"

import toast from "react-hot-toast"
import { EmailForm, emailSchema, OtpForm, otpSchema, PasswordForm, passwordSchema } from "@/lib/validations/auth"
import StepIndicator from "../StepIndicator"
import axiosInstance from "@/lib/axios"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { forgotPassword, verifyResetCode } from "@/lib/api/auth"


export default function ForgotPassword() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState("")
  const [resetToken, setResetToken] = useState("")

  // ── Step 0 — Email form ──────────────────────────────────────────────────────
  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  })


  const onEmailSubmit = async (data: EmailForm) => {
    try {
      // await axiosInstance.post("/auth/forgot-password", { email: data.email })
      await forgotPassword({ email: data.email })
      setEmail(data.email)
      setStep(1)
      toast.success("Reset code sent to your email")
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong"
      toast.error(message)
    }
  }

  // ── Step 1 — OTP form ────────────────────────────────────────────────────────
  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  })
  const onOtpSubmit = async (data: OtpForm) => {
    try {
      const response = await axiosInstance.post("/auth/verify-reset-code", {
        resetCode: data.resetCode,
      })
      // const response=await verifyResetCode({resetCode:data.resetCode})
      setResetToken(response.data.resetToken)
      setStep(2)
      toast.success("Code verified successfully")
    } catch (error: any) {
      const message = error?.response?.data?.message || "Invalid or expired code"
      toast.error(message)
    }
  }

  // ── Step 2 — New password form ───────────────────────────────────────────────
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      await axiosInstance.post("/auth/reset-password", {
        resetToken,
        newPassword: data.newPassword,
      })
      toast.success("Password reset successfully!")
      router.push("/login")
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong"
      toast.error(message)
    }
  }

  // ── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResend = async () => {
    try {
      await axiosInstance.post("/auth/forgot-password", { email })
      toast.success("New code sent to your email")
    } catch {
      toast.error("Failed to resend code")
    }
  }

  return (
    <div dir="ltr" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

          {/* Logo */}
          <Link href="/" className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <ShoppingBagIcon className="w-7 h-7 text-white" />
            </div>
          </Link>

          {/* Step Indicator */}
          <StepIndicator current={step} />

          <AnimatePresence mode="wait">

            {/* ── Step 0: Email ── */}
            {step === 0 && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Forgot password?</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    Enter your email and we'll send you a reset code
                  </p>
                </div>

                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                  <Input
                    label="Email address"
                    type="email"
                    placeholder="john@example.com"
                    icon={<Mail className="w-5 h-5" />}
                    error={emailForm.formState.errors.email?.message}
                    {...emailForm.register("email")}
                  />
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    isLoading={emailForm.formState.isSubmitting}
                  >
                    Send reset code
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ── Step 1: OTP ── */}
            {step === 1 && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    We sent a 6-digit code to
                  </p>
                  <p className="text-indigo-600 font-semibold text-sm">{email}</p>
                </div>

                <form dir="ltr" onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                  <Input
                    label="Reset code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    error={otpForm.formState.errors.resetCode?.message}
                    {...otpForm.register("resetCode")}
                  />
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    isLoading={otpForm.formState.isSubmitting}
                  >
                    Verify code
                  </Button>
                </form>

                <div className="flex items-center justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Resend code
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: New Password ── */}
            {step === 2 && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Create new password</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    Your new password must be at least 8 characters
                  </p>
                </div>

                <form dir="ltr" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <Input
                    label="New password"
                    type="password"
                    placeholder="At least 8 characters"
                    error={passwordForm.formState.errors.newPassword?.message}
                    {...passwordForm.register("newPassword")}
                  />
                  <Input
                    label="Confirm new password"
                    type="password"
                    placeholder="Re-enter new password"
                    error={passwordForm.formState.errors.confirmPassword?.message}
                    {...passwordForm.register("confirmPassword")}
                  />
                  <Button
                    type="submit"
                    variant="gradient"
                    size="lg"
                    className="w-full"
                    isLoading={passwordForm.formState.isSubmitting}
                  >
                    Reset password
                  </Button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Back to login */}
          <p className="text-center text-gray-500 mt-6 text-sm">
            Remember your password?{" "}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Sign in
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  )
}