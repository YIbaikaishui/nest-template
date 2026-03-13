import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

/**
 * 认证 Store
 * 管理 token 和当前用户信息，持久化到 localStorage
 */
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  function setToken(newToken: string): void {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function logout(): void {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isLoggedIn, setToken, logout }
})
