import http from '@/lib/http'
import type { ApiResponse, User, CreateUserPayload, UpdateUserPayload } from '@/types'

/** 查询所有用户 */
export async function getUsers(): Promise<User[]> {
  const res = await http.get<ApiResponse<User[]>>('/users')
  return res.data.data ?? []
}

/** 创建用户 */
export async function createUser(payload: CreateUserPayload): Promise<User> {
  const res = await http.post<ApiResponse<User>>('/users', payload)
  return res.data.data!
}

/** 更新用户 */
export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const res = await http.put<ApiResponse<User>>(`/users/${id}`, payload)
  return res.data.data!
}

/** 删除用户 */
export async function deleteUser(id: string): Promise<void> {
  await http.delete(`/users/${id}`)
}
