<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Loader2, Plus, Pencil, Trash2, Users } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/users'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'

const router = useRouter()
const auth = useAuthStore()

// 列表状态
const users = ref<User[]>([])
const loading = ref(true)

// 新增/编辑弹窗
const dialogOpen = ref(false)
const editingUser = ref<User | null>(null)
const submitting = ref(false)

// 删除确认弹窗
const deleteDialogOpen = ref(false)
const deletingUser = ref<User | null>(null)
const deleting = ref(false)

// 表单 schema
const userSchema = toTypedSchema(
  z.object({
    username: z.string().min(2, '用户名至少 2 个字符').max(64, '用户名最多 64 个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
  }),
)

const { handleSubmit, resetForm, setValues } = useForm({ validationSchema: userSchema })

// 加载用户列表
async function loadUsers(): Promise<void> {
  loading.value = true
  try {
    users.value = await getUsers()
  } catch (err) {
    toast.error(err instanceof Error ? err.message : '操作失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 打开新增弹窗
function openCreate(): void {
  editingUser.value = null
  resetForm()
  dialogOpen.value = true
}

// 打开编辑弹窗
function openEdit(user: User): void {
  editingUser.value = user
  setValues({ username: user.username, email: user.email })
  dialogOpen.value = true
}

// 提交表单（新增或编辑）
const onSubmit = handleSubmit(async (values) => {
  submitting.value = true
  try {
    if (editingUser.value) {
      await updateUser(editingUser.value.id, values)
      toast.success('更新成功')
    } else {
      await createUser(values)
      toast.success('创建成功')
    }
    dialogOpen.value = false
    await loadUsers()
  } catch (err) {
    toast.error(err instanceof Error ? err.message : '操作失败，请稍后重试')
  } finally {
    submitting.value = false
  }
})

// 打开删除确认
function openDelete(user: User): void {
  deletingUser.value = user
  deleteDialogOpen.value = true
}

// 确认删除
async function handleDelete(): Promise<void> {
  if (!deletingUser.value) return
  deleting.value = true
  try {
    await deleteUser(deletingUser.value.id)
    toast.success('删除成功')
    deleteDialogOpen.value = false
    await loadUsers()
  } catch (err) {
    toast.error(err instanceof Error ? err.message : '操作失败，请稍后重试')
  } finally {
    deleting.value = false
  }
}

// 退出登录
function handleLogout(): void {
  auth.logout()
  void router.push({ name: 'login' })
}

onMounted(loadUsers)
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- 顶部导航 -->
    <header class="border-b">
      <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <span class="font-semibold text-sm">T2 Program</span>
        <Button variant="ghost" size="sm" class="cursor-pointer" @click="handleLogout">
          退出登录
        </Button>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-8">
      <!-- 页面标题 + 新增按钮 -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-semibold">用户管理</h1>
        <Button class="cursor-pointer" @click="openCreate">
          <Plus class="mr-2 h-4 w-4" />
          新增用户
        </Button>
      </div>

      <!-- 加载骨架屏 -->
      <div v-if="loading" class="space-y-3">
        <Skeleton v-for="i in 5" :key="i" class="h-12 w-full rounded-md" />
      </div>

      <!-- 空状态 -->
      <div
        v-else-if="users.length === 0"
        class="flex flex-col items-center justify-center py-20 text-muted-foreground"
      >
        <Users class="h-12 w-12 mb-3" />
        <p class="text-base font-medium">暂无用户</p>
        <p class="text-sm mt-1">点击右上角「新增用户」添加第一个用户</p>
      </div>

      <!-- 用户表格 -->
      <div v-else class="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead class="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user.id">
              <TableCell class="font-medium">{{ user.username }}</TableCell>
              <TableCell class="text-muted-foreground">{{ user.email }}</TableCell>
              <TableCell class="text-muted-foreground text-sm">
                {{ new Date(user.createdAt).toLocaleDateString('zh-CN') }}
              </TableCell>
              <TableCell class="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  class="cursor-pointer mr-1"
                  @click="openEdit(user)"
                >
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  class="cursor-pointer text-destructive hover:text-destructive"
                  @click="openDelete(user)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </main>

    <!-- 新增/编辑弹窗 -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{{ editingUser ? '编辑用户' : '新增用户' }}</DialogTitle>
          <DialogDescription>
            {{ editingUser ? '修改用户信息' : '填写用户名和邮箱创建新用户' }}
          </DialogDescription>
        </DialogHeader>
        <form class="space-y-4" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="john_doe" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" class="cursor-pointer" @click="dialogOpen = false">
              取消
            </Button>
            <Button type="submit" class="cursor-pointer" :disabled="submitting">
              <Loader2 v-if="submitting" class="mr-2 h-4 w-4 animate-spin" />
              {{ submitting ? '保存中...' : '保存' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- 删除确认弹窗 -->
    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            此操作不可撤销，确认要删除用户「{{ deletingUser?.username }}」吗？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="cursor-pointer">取消</AlertDialogCancel>
          <AlertDialogAction
            class="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
            :disabled="deleting"
            @click="handleDelete"
          >
            <Loader2 v-if="deleting" class="mr-2 h-4 w-4 animate-spin" />
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
