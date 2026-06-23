'use client'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useAuthStore } from '@/store/authStore'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { User, Package, MapPin, Settings, Camera, Save, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useDeactivateAccount, useProfile, useUpdateProfile } from '@/hooks/useProfile'

const profileSchema = z.object({
  name:        z.string().min(3).max(30),
  phoneNumber: z.string().optional(),
})
type ProfileFormData = z.infer<typeof profileSchema>

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword:     z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
type PasswordFormData = z.infer<typeof passwordSchema>

export default function ProfileContent() {
  const router    = useRouter()
  const locale    = useLocale()
  const isRTL     = locale === 'ar'
  const isAuth    = useAuthStore((state) => !!state.accessToken)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const { data, isLoading, isError } = useProfile()
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile()
  const { mutate: deactivate,    isPending: isDeleting } = useDeactivateAccount()

  const profileForm  = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) })
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) })

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User size={36} className="text-text-muted mb-4" />
        <h2 className="text-xl font-bold text-text mb-4">
          {isRTL ? 'سجل دخولك لمشاهدة حسابك' : 'Login to view your account'}
        </h2>
        <Button  className="bg-brand hover:bg-brand-dark text-white">
          <Link href="/login">{isRTL ? 'تسجيل الدخول' : 'Login'}</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <div className="grid lg:grid-cols-[260px_1fr] gap-4">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !data?.data) {
    return (
      <div className="text-center text-destructive py-12">
        {isRTL ? 'حدث خطأ في تحميل البيانات' : 'Failed to load profile'}
      </div>
    )
  }

  const user = data.data

  const onSaveProfile = (formData: ProfileFormData) => {
    updateProfile(formData, {
      onSuccess: () => toast.success(isRTL ? 'تم حفظ التغييرات' : 'Changes saved'),
      onError:   () => toast.error(isRTL ? 'حدث خطأ' : 'Something went wrong'),
    })
  }

  const onChangePassword = (formData: PasswordFormData) => {
    toast.success(isRTL ? 'تم تغيير كلمة المرور' : 'Password changed')
    passwordForm.reset()
  }

  const handleDeactivate = () => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف الحساب؟' : 'Are you sure you want to delete your account?')) return
    deactivate(undefined, {
      onSuccess: () => {
        clearAuth()
        router.push('/')
      },
    })
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-bold text-text mb-6">
        {isRTL ? 'حسابي' : 'My Account'}
      </h1>

      <div className="grid lg:grid-cols-[260px_1fr] gap-4">

        {/* ── Sidebar — أول حاجة في الـ DOM دايماً ── */}
        <aside>
          <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5 sticky top-24">

            <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-[var(--color-border)]">
              <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mb-3">
                <span className="text-brand font-bold text-lg">
                  {user.name?.slice(0, 1).toUpperCase()}
                </span>
              </div>
              <p className="font-bold text-text text-sm">{user.name}</p>
              <p className="text-xs text-text-muted">{user.email}</p>
            </div>

            <nav className="flex flex-col gap-1">
              <Button variant="ghost" className="justify-start gap-3 bg-brand/10 text-brand">
                <User size={16} />
                {isRTL ? 'حسابي' : 'My Account'}
              </Button>
              <Button variant="ghost"  className="justify-start gap-3 text-text-muted">
                <Link href="/orders">
                  <Package size={16} />
                  {isRTL ? 'طلباتي' : 'My Orders'}
                </Link>
              </Button>
              <Button variant="ghost"  className="justify-start gap-3 text-text-muted">
                <Link href="/addresses">
                  <MapPin size={16} />
                  {isRTL ? 'عناويني' : 'Addresses'}
                </Link>
              </Button>
              <Button variant="ghost"  className="justify-start gap-3 text-text-muted">
                <Link href="/wishlist">
                  <Settings size={16} />
                  {isRTL ? 'المفضلة' : 'Wishlist'}
                </Link>
              </Button>
            </nav>
          </div>
        </aside>

        {/* ── Main Column ── */}
        <div className="space-y-4">

          {/* Identity Card */}
          <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <span className="text-brand font-bold">
                  {user.name?.slice(0, 1).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-bold text-text">{user.name}</p>
                <p className="text-sm text-text-muted">{user.email}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {isRTL ? 'عضو منذ' : 'Member since'} {new Date(user.createdAt).getFullYear()}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="w-9 h-9 rounded-lg bg-bg-secondary flex items-center justify-center text-text-muted hover:text-brand transition-colors shrink-0"
            >
              <Camera size={16} />
            </button>
          </div>

          {/* Personal Info */}
          <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5">
            <h3 className="font-bold text-text mb-4">
              {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
            </h3>
            <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-text-muted block">
                    {isRTL ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    defaultValue={user.name}
                    {...profileForm.register('name')}
                    className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-text-muted block">
                    {isRTL ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    value={user.email}
                    disabled
                    dir="ltr"
                    className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg-secondary text-text-muted text-sm opacity-70 text-end"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-text-muted block">
                    {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    defaultValue={user.phoneNumber}
                    placeholder="+201012345678"
                    {...profileForm.register('phoneNumber')}
                    dir="ltr"
                    className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand text-end"
                  />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isSaving}
                className="bg-brand hover:bg-brand-dark text-white gap-2"
              >
                <Save size={15} />
                {isRTL ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-bg rounded-2xl border border-[var(--color-border)] p-5">
            <h3 className="font-bold text-text mb-4">
              {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
            </h3>
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-text-muted block">
                    {isRTL ? 'كلمة المرور الحالية' : 'Current Password'}
                  </label>
                  <input
                    type="password"
                    dir="ltr"
                    {...passwordForm.register('currentPassword')}
                    className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand text-end"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm text-text-muted block">
                    {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <input
                    type="password"
                    dir="ltr"
                    {...passwordForm.register('newPassword')}
                    className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand text-end"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-text-muted block">
                    {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    dir="ltr"
                    {...passwordForm.register('confirmPassword')}
                    className="w-full h-10 px-3 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand text-end"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <Button type="submit" variant="outline">
                {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
              </Button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-destructive/5 rounded-2xl border border-destructive/20 p-5">
            <h3 className="font-bold text-destructive flex items-center gap-2 mb-2">
              <AlertTriangle size={16} />
              {isRTL ? 'منطقة الخطر' : 'Danger Zone'}
            </h3>
            <p className="text-sm text-text-muted mb-4">
              {isRTL
                ? 'حذف حسابك نهائياً، هذا الإجراء لا يمكن التراجع عنه.'
                : 'Permanently delete your account. This action cannot be undone.'
              }
            </p>
            <Button
              variant="destructive"
              onClick={handleDeactivate}
              isLoading={isDeleting}
            >
              {isRTL ? 'حذف الحساب' : 'Delete Account'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}