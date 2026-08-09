<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-bold text-gray-900">
      {{ label }}
    </label>
    <textarea 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :required="required"
      :rows="rows"
      class="block w-full rounded-2xl border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 sm:text-base transition-colors py-3.5 px-5 placeholder-gray-400 resize-y"
    ></textarea>
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
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  rows: {
    type: [String, Number],
    default: 3
  }
})

defineEmits(['update:modelValue'])
</script>
