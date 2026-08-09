<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="close"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden z-10 p-6 flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle class="w-6 h-6 text-red-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-gray-500 font-medium mb-6">{{ message }}</p>
          
          <div class="flex space-x-3 w-full">
            <button 
              @click="close"
              class="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="confirm"
              class="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-colors flex items-center justify-center"
              :disabled="loading"
            >
              <LoaderCircle v-if="loading" class="w-5 h-5 animate-spin" />
              <span v-else>{{ confirmText }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { AlertTriangle, LoaderCircle } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Are you sure?'
  },
  message: {
    type: String,
    default: 'This action cannot be undone.'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  if (props.loading) return
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
