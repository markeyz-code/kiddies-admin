<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">Coupons</h1>
        <p class="text-gray-500 font-medium">Manage discount coupons for your store</p>
      </div>
      <button 
        @click="isAddModalOpen = true; form = { code: '', discountType: 'percentage', discountValue: 0, isActive: true }"
        class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-full transition-colors text-sm shadow-sm flex items-center"
      >
        Add Coupon
      </button>
    </div>

    <!-- Table Header Info -->
    <div class="mb-4">
      <h2 class="text-lg font-bold text-gray-800">
        Coupon Records — <span class="font-normal">{{ filteredRows.length }} matching records</span>
      </h2>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="flex px-6 py-4 border-b border-gray-200 bg-gray-50">
        <CustomInput v-model="q" placeholder="Search coupons..." class="w-72">
          <template #leading>
            <Search class="w-4 h-4 text-gray-400" />
          </template>
        </CustomInput>
      </div>
      
      <div class="overflow-x-auto">
        <UTable :columns="columns" :data="filteredRows" :loading="loading" class="min-w-[800px]" :ui="{ th: { base: 'bg-white text-gray-500 font-bold py-4 border-b border-gray-200' }, td: { base: 'py-4 border-b border-gray-100 last:border-0 text-gray-700 font-medium align-middle' } }">
          
          <template #code-cell="{ row: { original: row } }">
            <div>
              <p class="font-bold text-gray-900 tracking-wider">{{ row.code }}</p>
            </div>
          </template>

          <template #discount-cell="{ row: { original: row } }">
            <span class="font-semibold text-gray-800">
              <span v-if="row.discountType === 'percentage'">{{ row.discountValue }}%</span>
              <span v-else>₦{{ row.discountValue?.toFixed(2) || '0.00' }}</span>
            </span>
            <span class="text-xs text-gray-500 ml-1">Off</span>
          </template>

          <template #loading>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500">
              <LoaderCircle class="w-8 h-8 animate-spin mb-4 text-emerald-700" />
              <span class="text-sm font-medium">Loading coupons...</span>
            </div>
          </template>
          
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500 font-medium">
              <Inbox class="w-12 h-12 mb-4 text-gray-300" />
              <span class="text-sm font-medium">No coupons found.</span>
            </div>
          </template>
          
          <template #status-cell="{ row: { original: row } }">
            <span v-if="row.isActive" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Active</span>
            <span v-else class="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Inactive</span>
          </template>
          
          <template #actions-cell="{ row: { original: row } }">
            <div class="flex items-center space-x-2">
              <button class="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors" @click="handleDelete(row._id)" title="Delete">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </template>
        </UTable>
      </div>
      
      <!-- Pagination -->
      <div class="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
        <div>Showing <span class="font-medium text-gray-900">1</span> to <span class="font-medium text-gray-900">{{ coupons.length }}</span> of <span class="font-medium text-gray-900">{{ coupons.length }}</span> results</div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
          <button class="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Delete Coupon"
      message="Are you sure you want to delete this coupon? This action cannot be undone."
      confirm-text="Delete"
      @confirm="executeDelete"
    />

    <!-- Add Coupon Modal -->
    <CustomModal v-model="isAddModalOpen" title="Add New Coupon" maxWidth="2xl">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <CustomInput 
          v-model="form.code" 
          label="Coupon Code" 
          placeholder="e.g. SUMMER50" 
          required
        >
          <template #leading>
            <Tag class="w-5 h-5 text-gray-400" />
          </template>
        </CustomInput>
        
        <CustomSelect 
          v-model="form.discountType" 
          label="Discount Type" 
          :options="[{ label: 'Percentage (%)', value: 'percentage' }, { label: 'Fixed Amount (₦)', value: 'fixed' }]" 
        />
        
        <CustomInput 
          v-model="form.discountValue" 
          type="number"
          label="Discount Value" 
          placeholder="Value" 
          required
        />
        
        <CustomSelect 
          v-model="form.isActive" 
          label="Status" 
          :options="[{ label: 'Active', value: true }, { label: 'Inactive', value: false }]" 
        />

        <div class="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            @click="isAddModalOpen = false" 
            class="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-full transition-colors flex items-center justify-center min-w-[120px]"
            :disabled="loading"
          >
            <span v-if="!loading">Save Coupon</span>
            <LoaderCircle v-else class="w-5 h-5 animate-spin" />
          </button>
        </div>
      </form>
    </CustomModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Tag, LoaderCircle, Inbox, Search, Trash2 } from 'lucide-vue-next'
import { useCoupons } from '@/composables/modules/coupons/useCoupons'

// definePageMeta({
//   layout: 'dashboard'
// });

const { loading, coupons, fetchCoupons, createCoupon, deleteCoupon } = useCoupons();
const toast = useToast()

const q = ref('')
const isAddModalOpen = ref(false)
const showDeleteConfirm = ref(false)
const couponToDelete = ref(null)

const form = ref({
  code: '',
  discountType: 'percentage',
  discountValue: 0,
  isActive: true
})

onMounted(() => {
  fetchCoupons()
})

const columns = [
  { accessorKey: 'code', header: 'Coupon Code' },
  { accessorKey: 'discount', header: 'Discount' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'actions', header: 'Actions' }
]

const filteredRows = computed(() => {
  if (!coupons.value) return []
  if (!q.value) return coupons.value
  
  return coupons.value.filter((coupon) => 
    (coupon.code || '').toLowerCase().includes(q.value.toLowerCase())
  )
})

const handleSubmit = async () => {
  try {
    await createCoupon(form.value)
    isAddModalOpen.value = false
    form.value = { code: '', discountType: 'percentage', discountValue: 0, isActive: true }
    // Fetch coupons after creation if needed
    // await fetchCoupons()
  } catch (error) {
    // Error is handled in the composable
  }
}

const handleDelete = (id) => {
  couponToDelete.value = id
  showDeleteConfirm.value = true
}

const executeDelete = async () => {
  if (!couponToDelete.value) return
  
  try {
    await deleteCoupon(couponToDelete.value)
    showDeleteConfirm.value = false
    couponToDelete.value = null
  } catch (error) {
    // Error is handled in the composable
  }
}
</script>
