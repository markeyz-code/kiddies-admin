<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-bold text-gray-900">
      {{ label }}
    </label>
    <div class="relative">
      <div v-if="$slots.leading" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
        <slot name="leading"></slot>
      </div>
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :step="step"
        class="block w-full rounded-full border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-base transition-colors py-3.5 placeholder-gray-400"
        :class="[$slots.leading ? 'pl-11' : 'pl-5', $slots.trailing ? 'pr-11' : 'pr-5']"
      />
      <div v-if="$slots.trailing" class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
        <slot name="trailing"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  step: {
    type: [String, Number],
    default: null
  }
})

defineEmits(['update:modelValue'])
</script>
