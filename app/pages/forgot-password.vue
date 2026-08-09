<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative z-10">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 text-primary-600 mb-6">
          <KeyRound class="w-8 h-8" />
        </div>
        <h2 class="text-xl font-bold text-gray-900">Forgot Password</h2>
        <p class="mt-2 text-sm font-medium text-gray-500">Enter your email to receive a reset token</p>
      </div>

      <form class="space-y-6" @submit.prevent="handleForgotPassword">
        <UFormField label="Email Address" name="email">
          <UInput v-model="email" type="email" placeholder="admin@jasmarkids.com" class="w-full" size="xl" required>
            <template #leading>
              <Mail class="w-5 h-5 text-gray-400" />
            </template>
          </UInput>
        </UFormField>

        <div class="flex items-center justify-between">
          <NuxtLink to="/login" class="text-sm font-semibold text-primary-600 hover:text-primary-500">Back to Login</NuxtLink>
        </div>

        <UButton type="submit" color="primary" class="w-full flex justify-center py-2.5 font-bold text-[15px]" size="xl" :loading="loading" :disabled="loading">
          <span v-if="!loading">Send Reset Token</span>
          <LoaderCircle v-else class="w-5 h-5 animate-spin" />
        </UButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { KeyRound, Mail, LoaderCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth/useAuth'

definePageMeta({
  layout: false
})

const { forgotPassword, loading } = useAuth()
const email = ref('')

const handleForgotPassword = async () => {
  await forgotPassword({ email: email.value })
}
</script>
