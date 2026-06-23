import axios from 'axios'

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request Interceptor ──────────────────────────
// run before every request
axiosInstance.interceptors.request.use(
  (config) => {
  
    if (config.headers.Authorization) return config

    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth')
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage)
          const token  = parsed?.state?.accessToken
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch {}
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ─────────────────────────
//run after every response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // const isAuthPage =
        //   window.location.pathname === '/login' ||
        //   window.location.pathname === '/register'

        const authStorage = localStorage.getItem('auth')
        const hadToken = authStorage && JSON.parse(authStorage)?.state?.accessToken


        if (!hadToken) {
          // localStorage.removeItem('auth')
          // window.location.href = '/login'

             return Promise.reject(error)
        }
           const isAuthPage =
          window.location.pathname === '/login' ||
          window.location.pathname === '/register'
           if (!isAuthPage) {
          localStorage.removeItem('auth')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance