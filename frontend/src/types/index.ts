/** 后端统一响应体 */
export interface ApiResponse<T> {
  success: boolean
  code: number
  message: string
  data: T | null
  timestamp: string
}

/** 用户实体 */
export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

/** 认证结果 */
export interface AuthResult {
  token: string
}

/** 创建用户请求 */
export interface CreateUserPayload {
  username: string
  email: string
}

/** 更新用户请求 */
export interface UpdateUserPayload {
  username?: string
  email?: string
}

/** 注册请求 */
export interface RegisterPayload {
  username: string
  email: string
  password: string
}

/** 登录请求 */
export interface LoginPayload {
  email: string
  password: string
}
