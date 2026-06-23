'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocale } from 'next-intl'
import toast from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useUpdateProfile } from '@/hooks/useProfile'
import { profileSchema, type ProfileFormData } from '@/lib/validations/profile'
import type { User } from '@/types/user'

interface Props {
  user: User
}

export default function ProfileForm({ user }: Props) {
  const locale = useLocale()
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name:        user.name,
      age:         user.age,
      phoneNumber: user.phoneNumber ?? '',
      address:     user.address ?? '',
      gender:      user.gender,
    },
  })

  const onSubmit = (formData: ProfileFormData) => {
    const dto = {
      ...formData,
      age: formData.age ? Number(formData.age) : undefined,
    }

    updateProfile(dto, {
      onSuccess: () => toast.success(locale === 'ar' ? 'تم تحديث البيانات بنجاح' : 'Profile updated successfully'),
      onError:   () => toast.error(locale === 'ar' ? 'حدث خطأ' : 'Something went wrong'),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir="ltr">

      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name">{locale === 'ar' ? 'الاسم' : 'Name'}</Label>
        <Input id="name" {...register('name')} error={errors.name?.message} />
      </div>

      {/* Email — Read only */}
      <div className="space-y-1.5">
        <Label>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
        <Input value={user.email} disabled className="opacity-60" />
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phoneNumber">{locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
        <Input
          id="phoneNumber"
          placeholder="+201012345678"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
        />
      </div>

      {/* Age */}
      <div className="space-y-1.5">
        <Label htmlFor="age">{locale === 'ar' ? 'العمر' : 'Age'}</Label>
        <Input id="age" type="number" {...register('age')} error={errors.age?.message} />
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <Label htmlFor="address">{locale === 'ar' ? 'العنوان' : 'Address'}</Label>
        <Input id="address" {...register('address')} error={errors.address?.message} />
      </div>

      {/* Gender */}
      <div className="space-y-1.5">
        <Label htmlFor="gender">{locale === 'ar' ? 'النوع' : 'Gender'}</Label>
        <select
          id="gender"
          {...register('gender')}
          className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-bg text-text text-sm outline-none focus:border-brand"
        >
          <option value="">{locale === 'ar' ? 'اختر' : 'Select'}</option>
          <option value="male">{locale === 'ar' ? 'ذكر' : 'Male'}</option>
          <option value="female">{locale === 'ar' ? 'أنثى' : 'Female'}</option>
        </select>
      </div>

      <Button
        type="submit"
        isLoading={isPending}
        variant="gradient"
        size="lg"
        className="w-full"
      >
        {locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
      </Button>
    </form>
  )
}