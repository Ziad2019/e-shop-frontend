import axiosInstance from '@/lib/axios'
import { jwtDecode } from 'jwt-decode'

export interface SignUpDto {
  name:     string
  email:    string
  password: string
}

export interface LoginDto {
  email:    string
  password: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface VerifyResetCodeDto {
  resetCode: string
}


export interface AuthResponse {
  status:       number
  message:      string
  access_token: string
}


export interface TokenPayload {
  sub:   string
  id:    string
  email: string
  role:  string
  name?: string
}


export const decodeUser = (token: string) => {
  const payload = jwtDecode<TokenPayload>(token)
  return {
    _id:   payload.sub,
    name:  payload.name ?? '',
    email: payload.email,
    role:  payload.role,
  }
}

export const signup = async (dto: SignUpDto): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/signup', dto)
  return data
}

export const login = async (dto: LoginDto): Promise<AuthResponse> => {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/login', dto)
  return data
}

export const forgotPassword = async (dto: ForgotPasswordDto) => {
  const { data } = await axiosInstance.post('/auth/forgot-password', dto)
  return data
}

export const verifyResetCode = async (dto: VerifyResetCodeDto) => {
  const { data } = await axiosInstance.post('/auth/verify-reset-code', dto)
  return data
}

export const getMe = async (token: string) => {
  console.log('token being sent:', token)  
  
  const { data } = await axiosInstance.get('/userMe', {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  const user = data.data
 return user
}