<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-8">
      <div>
        <h1 class="text-2xl font-bold">Product Reviews</h1>
        <p class="text-gray-500 font-medium">Moderate customer feedback shown on the storefront.</p>
      </div>
      <button @click="loadReviews" :disabled="loading" class="bg-brand-700 hover:bg-brand-800 text-white font-bold py-2.5 px-5 rounded-full text-sm disabled:opacity-50">
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <LoaderCircle class="w-8 h-8 animate-spin text-brand-700" />
    </div>

    <div v-else-if="reviews.length === 0" class="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500 font-medium">
      No reviews have been submitted yet.
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div v-for="review in reviews" :key="review._id" class="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
        <div class="flex justify-between items-start gap-3">
          <div>
            <p class="font-bold text-gray-900">{{ review.productId?.name || 'Deleted product' }}</p>
            <p class="text-xs text-gray-500">{{ review.userId?.firstName }} {{ review.userId?.lastName }} · {{ review.userId?.email }}</p>
          </div>
          <div class="text-[#f1a415] text-lg leading-none">
            <span v-for="i in 5" :key="i" :class="i <= review.rating ? '' : 'text-gray-200'">★</span>
          </div>
        </div>
        <p class="text-sm text-gray-700 mt-3 flex-1">{{ review.comment }}</p>
        <div class="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <span class="text-xs text-gray-400">{{ new Date(review.createdAt).toLocaleString() }}</span>
          <button @click="askDelete(review)" class="text-xs font-bold text-red-600 hover:text-red-700">Delete review</button>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Delete Review"
      message="Delete this review? The product rating will be recalculated."
      confirm-text="Delete"
      :loading="deleting"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { LoaderCircle } from 'lucide-vue-next'
import { reviewsApi } from '@/api_factory/modules/reviews'

const toast = useToast()
const reviews = ref([])
const loading = ref(true)
const deleting = ref(false)
const showDeleteConfirm = ref(false)
const pendingDelete = ref(null)

const loadReviews = async () => {
  loading.value = true
  try {
    const { data } = await reviewsApi.getReviews()
    reviews.value = data || []
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to load reviews', color: 'red' })
  } finally {
    loading.value = false
  }
}

const askDelete = (review) => {
  pendingDelete.value = review
  showDeleteConfirm.value = true
}

const executeDelete = async () => {
  if (!pendingDelete.value) return
  deleting.value = true
  try {
    await reviewsApi.deleteReview(pendingDelete.value._id)
    reviews.value = reviews.value.filter((r) => r._id !== pendingDelete.value._id)
    toast.add({ title: 'Deleted', description: 'Review removed', color: 'emerald' })
    showDeleteConfirm.value = false
    pendingDelete.value = null
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to delete review', color: 'red' })
  } finally {
    deleting.value = false
  }
}

onMounted(loadReviews)
</script>
