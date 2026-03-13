import axios from 'axios'
import type { ApiResponse } from '@/types'
import { useAuthStore } from '@/stores/auth'

/**
 * axios 实例
 * 统一处理请求头（Bearer token）和响应错误
 */
const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截：自动附加 JWT token
http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

// 响应拦截：统一提取 data，业务失败时抛出错误
http.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse<unknown>
    if (!res.success) {
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return response
  },
  (error) => {
    // 401 未授权时清除登录状态并跳转登录页
    if (error.response?.status === 401) {
      const auth = useAuthStore()
      auth.logout()
      window.location.href = '/login'
    }
    const message = (error.response?.data as ApiResponse<unknown>)?.message || '操作失败，请稍后重试'
    return Promise.reject(new Error(message))
  },
)

export default http
