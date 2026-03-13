import http from '@/lib/http'
import type { ApiResponse, AuthResult, RegisterPayload, LoginPayload } from '@/types'

/** 注册 */
export async function register(payload: RegisterPayload): Promise<string> {
  const res = await http.post<ApiResponse<AuthResult>>('/auth/register', payload)
  return res.data.data!.token
}

/** 登录 */
export async function login(payload: LoginPayload): Promise<string> {
  const res = await http.post<ApiResponse<AuthResult>>('/auth/login', payload)
  return res.data.data!.token
}
