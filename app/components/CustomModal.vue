<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 backdrop-blur-sm p-4 sm:p-0">
    <!-- Click outside to close -->
    <div class="fixed inset-0" @click="$emit('update:modelValue', false)"></div>
    
    <!-- Modal Content -->
    <div 
      class="relative bg-white rounded-2xl shadow-xl w-full mx-auto transform transition-all"
      :class="[maxWidthClass]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
        <button 
          @click="$emit('update:modelValue', false)"
          class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-5">
        <slot></slot>
      </div>
      
      <!-- Footer (Optional) -->
      <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  maxWidth: {
    type: String,
    default: 'md' // sm, md, lg, xl, 2xl, 3xl
  }
})

defineEmits(['update:modelValue'])

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm': return 'max-w-sm'
    case 'md': return 'max-w-md'
    case 'lg': return 'max-w-lg'
    case 'xl': return 'max-w-xl'
    case '2xl': return 'max-w-2xl'
    case '3xl': return 'max-w-3xl'
    default: return 'max-w-md'
  }
})
</script>
