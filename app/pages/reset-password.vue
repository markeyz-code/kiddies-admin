<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative z-10">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-6">
          <ShieldCheck class="w-8 h-8" />
        </div>
        <h2 class="text-xl font-bold text-gray-900">Reset Password</h2>
        <p class="mt-2 text-sm font-medium text-gray-500">Enter your reset token and new password</p>
      </div>

      <form class="space-y-6" @submit.prevent="handleResetPassword">
        <UFormField label="Reset Token" name="token">
          <UInput v-model="token" type="text" placeholder="Paste token here" class="w-full" size="xl" required>
            <template #leading>
              <Hash class="w-5 h-5 text-gray-400" />
            </template>
          </UInput>
        </UFormField>

        <UFormField label="New Password" name="password">
          <UInput v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" class="w-full" size="xl" required>
            <template #leading>
              <Lock class="w-5 h-5 text-gray-400" />
            </template>
            <template #trailing>
              <button type="button" @click="showPassword = !showPassword" class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded p-1 transition-colors">
                <EyeOff v-if="showPassword" class="w-5 h-5" />
                <Eye v-else class="w-5 h-5" />
              </button>
            </template>
          </UInput>
        </UFormField>

        <div class="flex items-center justify-between">
          <NuxtLink to="/login" class="text-sm font-semibold text-primary-600 hover:text-primary-500">Back to Login</NuxtLink>
        </div>

        <UButton type="submit" color="primary" class="w-full flex justify-center py-2.5 font-bold text-[15px]" size="xl" :loading="loading" :disabled="loading">
          <span v-if="!loading">Reset Password</span>
          <LoaderCircle v-else class="w-5 h-5 animate-spin" />
        </UButton>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ShieldCheck, Hash, Lock, Eye, EyeOff, LoaderCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth/useAuth'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: false
})

const route = useRoute()
const { resetPassword, loading } = useAuth()
const token = ref('')
const password = ref('')
const showPassword = ref(false)

onMounted(() => {
    if (route.query.token) {
        token.value = String(route.query.token)
    }
})

const handleResetPassword = async () => {
  await resetPassword({ token: token.value, newPassword: password.value })
}
</script>
