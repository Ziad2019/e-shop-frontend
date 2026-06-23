import type { Metadata } from 'next'
import ProfileContent from '@/components/profile/ProfileContent'

export const metadata: Metadata = {
  title:       'الملف الشخصي | E-Shop',
  description: 'إدارة بيانات حسابك',
}

export default function ProfilePage() {
  return (
    <div className="container-custom py-8">
      <ProfileContent />
    </div>
  )
}