<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { register } from '@/lib/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const loading = ref(false)

const schema = toTypedSchema(
  z.object({
    username: z.string().min(2, '用户名至少 2 个字符').max(64, '用户名最多 64 个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string().min(6, '密码至少 6 位').max(128, '密码最多 128 位'),
  }),
)

const { handleSubmit } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    const token = await register(values)
    auth.setToken(token)
    toast.success('注册成功，欢迎加入！')
    await router.push({ name: 'users' })
  } catch (err) {
    toast.error(err instanceof Error ? err.message : '操作失败，请稍后重试')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl font-semibold">注册</CardTitle>
        <CardDescription>创建你的账号</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input
                  placeholder="john_doe"
                  autocomplete="username"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  autocomplete="email"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full cursor-pointer" :disabled="loading">
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? '注册中...' : '注册' }}
          </Button>
        </form>

        <p class="mt-4 text-center text-sm text-muted-foreground">
          已有账号？
          <RouterLink to="/login" class="text-foreground underline underline-offset-4 hover:opacity-80">
            立即登录
          </RouterLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
