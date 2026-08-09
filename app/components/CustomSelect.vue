<template>
  <div class="space-y-2 relative" ref="selectContainer">
    <label v-if="label" class="block text-sm font-bold text-gray-900">
      {{ label }}
    </label>
    <div class="relative">
      <button
        type="button"
        @click="isOpen = !isOpen"
        class="block w-full rounded-full border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-base transition-colors py-3.5 pl-5 pr-11 text-left relative focus:outline-none"
        :class="{ 'text-gray-400': !modelValue }"
      >
        <span class="block truncate">{{ displayValue || placeholder }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <ChevronDown class="h-5 w-5 text-gray-500 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
        </span>
      </button>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <ul
          v-if="isOpen"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <li
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option)"
            class="relative cursor-pointer select-none py-2 pl-5 pr-9 text-gray-900 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
          >
            <span :class="['block truncate', modelValue === option.value ? 'font-bold' : 'font-normal']">
              {{ option.label }}
            </span>
            <span v-if="modelValue === option.value" class="absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-600">
              <Check class="h-5 w-5" />
            </span>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  options: {
    type: Array,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectContainer = ref(null)

const displayValue = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : ''
})

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (selectContainer.value && !selectContainer.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
