<template>
  <div class="h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans font-medium transition-colors duration-300">
    <!-- Desktop Sidebar -->
    <aside
      class="hidden md:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 relative select-none transition-colors duration-300"
      :style="{ width: sidebarWidth + 'px', minWidth: '56px' }"
    >
      <div class="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 overflow-hidden">
        <span v-if="!isCollapsed" class="text-lg font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap">JasmarKids Admin</span>
        <span v-else class="text-lg font-bold text-primary-600 dark:text-primary-400">JK</span>
      </div>

      <!-- Collapse Toggle -->
      <button
        @click="toggleCollapse"
        class="absolute top-20 -right-3 z-20 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
      >
        <ChevronLeft v-if="!isCollapsed" class="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
        <ChevronRight v-else class="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
      </button>

      <nav class="flex-1 p-2 space-y-1 overflow-y-auto overflow-x-hidden">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap overflow-hidden"
          active-class="bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400"
          :title="item.name"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed">{{ item.name }}</span>
        </NuxtLink>
      </nav>

      <div class="p-2 border-t border-gray-200 dark:border-gray-800">
        <button @click="confirmLogout" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors w-full whitespace-nowrap overflow-hidden">
          <LogOut class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed">Logout</span>
        </button>
      </div>

      <!-- Resize Handle -->
      <div
        v-if="!isCollapsed"
        class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-emerald-400 active:bg-emerald-500 transition-colors z-10"
        @mousedown="startResize"
      ></div>
    </aside>

    <!-- Mobile Slideover -->
    <USlideover v-model:open="isMobileMenuOpen" side="left" :ui="{ width: 'max-w-xs' }">
      <template #content>
        <div class="flex flex-col h-full bg-white dark:bg-gray-900">
          <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
            <span class="text-xl font-bold text-primary-600 dark:text-primary-400">JasmarKids Admin</span>
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="isMobileMenuOpen = false">
              <X class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </UButton>
          </div>
          <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
            <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" @click="isMobileMenuOpen = false" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" active-class="bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400">
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.name }}
            </NuxtLink>
          </nav>
          <div class="p-4 border-t border-gray-200 dark:border-gray-800">
            <button @click="confirmLogout" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors w-full">
              <LogOut class="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </template>
    </USlideover>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Header -->
      <header class="h-14 md:h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-3 md:px-6 flex-shrink-0 transition-colors duration-300">
        <div class="flex items-center gap-3">
          <button class="md:hidden p-2 -ml-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg" @click="isMobileMenuOpen = true">
            <Menu class="w-5 h-5" />
          </button>
          <span class="text-base font-bold text-gray-900 dark:text-white md:hidden truncate">JasmarKids</span>
        </div>
        <div class="flex items-center space-x-3">
          <ClientOnly>
            <UButton
              :icon="$colorMode.preference === 'dark' ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
              color="gray"
              variant="ghost"
              aria-label="Theme"
              @click="$colorMode.preference = $colorMode.value === 'dark' ? 'light' : 'dark'"
            />
          </ClientOnly>
          <UAvatar alt="Admin" size="sm" />
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <slot />
      </main>
    </div>
    <ConfirmModal
      v-model="showLogoutConfirm"
      title="Confirm Logout"
      message="Are you sure you want to log out of the admin panel?"
      confirm-text="Logout"
      @confirm="handleLogout"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { LayoutDashboard, Tag, Folders, ShoppingBag, Users, Settings, LogOut, MessageSquare, Menu, X, Activity, Shield, Ticket, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth/useAuth'

const { logout } = useAuth()

const isMobileMenuOpen = ref(false)
const showLogoutConfirm = ref(false)

// Sidebar resize state
const DEFAULT_WIDTH = 240
const MIN_WIDTH = 180
const MAX_WIDTH = 400
const COLLAPSED_WIDTH = 56

const sidebarWidth = ref(DEFAULT_WIDTH)
const isCollapsed = ref(false)
let isResizing = false

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  sidebarWidth.value = isCollapsed.value ? COLLAPSED_WIDTH : DEFAULT_WIDTH
}

const startResize = (e) => {
  isResizing = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'

  const onMouseMove = (e) => {
    if (!isResizing) return
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX))
    sidebarWidth.value = newWidth
  }

  const onMouseUp = () => {
    isResizing = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const confirmLogout = () => {
  showLogoutConfirm.value = true
}

const handleLogout = () => {
  showLogoutConfirm.value = false
  logout()
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/dashboard/products', icon: Tag },
  { name: 'Categories', path: '/dashboard/categories', icon: Folders },
  { name: 'Product Policies', path: '/dashboard/policies', icon: Shield },
  { name: 'Coupons', path: '/dashboard/coupons', icon: Ticket },
  { name: 'Orders', path: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Customers', path: '/dashboard/customers', icon: Users },
  { name: 'Audit Logs', path: '/dashboard/audit-logs', icon: Activity },
  { name: 'Live Chat', path: '/dashboard/chat', icon: MessageSquare },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings }
]
</script>
