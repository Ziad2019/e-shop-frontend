import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyProfile, updateMyProfile, deactivateMyAccount, uploadAvatar } from '@/lib/api/users'
import type { UpdateProfileDto } from '@/types/user'
import { useAuthStore } from '@/store/authStore'

export const profileKeys = {
  me: ['profile', 'me'] as const,
}

export function useProfile() {
  const isAuth = useAuthStore((state) => !!state.accessToken)

  return useQuery({
    queryKey: profileKeys.me,
    queryFn:  getMyProfile,
    enabled:  isAuth,
    staleTime: 60 * 1000,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const token   = useAuthStore((state) => state.accessToken)

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => updateMyProfile(dto),
    onSuccess: (res) => {
      queryClient.setQueryData(profileKeys.me, res)
      // حدّث الـ user في الـ authStore كمان
      if (token) setAuth(res.data as any, token)
    },
  })
}

export function useDeactivateAccount() {
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return useMutation({
    mutationFn: deactivateMyAccount,
    onSuccess: () => {
      clearAuth()
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)
  const token   = useAuthStore((state) => state.accessToken)

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: (res) => {
      queryClient.setQueryData(profileKeys.me, res)
      if (token) setAuth(res.data as any, token)
    },
  })
}