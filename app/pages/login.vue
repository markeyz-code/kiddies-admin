<template>
  <div class="min-h-screen flex w-full">
    <!-- Left Side: Image -->
    <div class="hidden lg:flex w-1/2 bg-gray-200 relative items-center justify-center overflow-hidden">
      <!-- You can place an actual image here, using a placeholder gradient for now -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
      <div class="relative z-10 w-full h-full flex items-center justify-center p-12">
         <!-- Abstract representation of the coins in the screenshot -->
         <div class="grid grid-cols-2 gap-12 opacity-40">
           <div class="w-32 h-32 rounded-full bg-gray-400 shadow-2xl border-4 border-gray-300"></div>
           <div class="w-32 h-32 rounded-full bg-gray-400 shadow-2xl border-4 border-gray-300 translate-y-16"></div>
           <div class="w-32 h-32 rounded-full bg-gray-400 shadow-2xl border-4 border-gray-300"></div>
           <div class="w-32 h-32 rounded-full bg-gray-400 shadow-2xl border-4 border-gray-300 translate-y-16"></div>
         </div>
      </div>
    </div>

    <!-- Right Side: Form -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-8 sm:p-12 lg:p-24 relative">
      <div class="w-full max-w-md">
        <div class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">JasmarKids Admin Portal</h2>
          <p class="text-gray-500 font-medium text-sm">Sign in to your account</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-1.5">
            <label class="block text-sm font-bold text-gray-800">Email Address</label>
            <CustomInput 
              v-model="email" 
              type="email" 
              placeholder="e.g. admin@jasmarkids.com" 
              required
            >
              <template #leading>
                <Mail class="w-5 h-5 text-gray-400" />
              </template>
            </CustomInput>
          </div>
          
          <div class="space-y-1.5">
            <label class="block text-sm font-bold text-gray-800">Password</label>
            <CustomInput 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••••••" 
              required
            >
              <template #leading>
                <Lock class="w-5 h-5 text-gray-400" />
              </template>
              <template #trailing>
                <button type="button" @click="showPassword = !showPassword" class="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors mr-1">
                  <EyeOff v-if="showPassword" class="w-5 h-5" />
                  <Eye v-else class="w-5 h-5" />
                </button>
              </template>
            </CustomInput>
            <div class="flex justify-end pt-1">
              <NuxtLink to="/forgot-password" class="text-xs font-semibold text-emerald-700 hover:text-emerald-600 transition-colors">
                Forgot Password?
              </NuxtLink>
            </div>
          </div>

          <div class="pt-2">
            <button 
              type="submit" 
              class="w-full flex items-center justify-center py-3.5 px-4 rounded-full font-bold text-[15px] bg-emerald-700 hover:bg-emerald-800 text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
              :disabled="loading"
            >
              <span v-if="!loading">Sign In</span>
              <LoaderCircle v-else class="w-5 h-5 animate-spin" />
            </button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="absolute bottom-8 w-full text-center px-4">
        <p class="text-xs text-gray-400 font-medium">© {{ new Date().getFullYear() }} JasmarKids. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Lock, Mail, Eye, EyeOff, LoaderCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth/useAuth'

definePageMeta({
  layout: false
})

const { login, loading } = useAuth()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  await login({ email: email.value, password: password.value })
}
</script>
