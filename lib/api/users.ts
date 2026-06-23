import axiosInstance from '@/lib/axios'
import type { User, UpdateProfileDto } from '@/types/user'

export interface UserMeResponse {
  status:  number
  message: string
  data:    User
}

export const getMyProfile = async (): Promise<UserMeResponse> => {
  const { data } = await axiosInstance.get<UserMeResponse>('/userMe')
  return data
}

export const updateMyProfile = async (dto: UpdateProfileDto): Promise<UserMeResponse> => {
  const { data } = await axiosInstance.patch<UserMeResponse>('/userMe', dto)
  return data
}

export const deactivateMyAccount = async () => {
  const { data } = await axiosInstance.delete('/userMe')
  return data
}

export const uploadAvatar = async (file: File): Promise<UserMeResponse> => {
  const formData = new FormData()
  formData.append('avatar', file)

  const { data } = await axiosInstance.patch<UserMeResponse>('/userMe/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}