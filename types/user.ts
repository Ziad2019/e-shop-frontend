export interface User {
  _id:          string
  name:         string
  email:        string
  role:         'user' | 'admin'
  avatar?:      string
  age?:         number
  phoneNumber?: string
  address?:     string
  gender?:      'male' | 'female'
  active:       boolean
  createdAt:    string
  updatedAt:    string
}

export interface UpdateProfileDto {
  name?:        string
  age?:         number
  phoneNumber?: string
  address?:     string
  gender?:      'male' | 'female'
  avatar?:      string
}