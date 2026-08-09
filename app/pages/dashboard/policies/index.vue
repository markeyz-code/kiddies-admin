<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">Product Policies</h1>
        <p class="text-gray-500 font-medium">Manage product details, shipping and returns configurations</p>
      </div>
      <UButton color="primary" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-full" @click="openAddModal">Add Policy</UButton>
    </div>

    <div class="mb-4">
      <h2 class="text-lg font-bold text-gray-800">
        Policy Profiles — <span class="font-normal">{{ filteredRows.length }} matching records</span>
      </h2>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="flex px-6 py-4 border-b border-gray-200 bg-gray-50">
        <CustomInput v-model="q" placeholder="Search policies..." class="w-72">
          <template #leading>
            <Search class="w-4 h-4 text-gray-400" />
          </template>
        </CustomInput>
      </div>
      <div class="overflow-x-auto">
        <UTable :columns="columns" :data="filteredRows" :loading="loading" class="min-w-[800px]" :ui="{ th: { base: 'bg-white text-gray-500 font-bold py-4 border-b border-gray-200' }, td: { base: 'py-4 border-b border-gray-100 last:border-0 text-gray-700 font-medium align-middle' } }">
          
          <template #name-cell="{ row: { original: row } }">
            <span class="font-bold text-gray-900">{{ row.name }}</span>
          </template>

          <template #actions-cell="{ row: { original: row } }">
            <UDropdownMenu :items="items(row)" :content="{ align: 'end' }">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </UDropdownMenu>
          </template>

          <template #loading>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500">
              <LoaderCircle class="w-8 h-8 animate-spin mb-4 text-emerald-700" />
              <span class="text-sm font-medium">Loading policies...</span>
            </div>
          </template>
          
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500 font-medium">
              <Shield class="w-12 h-12 mb-4 text-gray-300" />
              <span class="text-sm font-medium">No policies found.</span>
            </div>
          </template>
        </UTable>
      </div>
    </div>

    <!-- Add Policy Modal -->
    <CustomModal v-model="isAddModalOpen" :title="isEditing ? 'Edit Policy Profile' : 'Create Policy Profile'" maxWidth="2xl">
      <form @submit.prevent="handleSubmitPolicy" class="space-y-5">
        <CustomInput 
          v-model="newPolicy.name" 
          label="Profile Name" 
          placeholder="e.g. Standard Clothing Policy" 
          required
        >
          <template #leading>
            <Shield class="w-5 h-5 text-gray-400" />
          </template>
        </CustomInput>
        
        <CustomTextarea 
          v-model="newPolicy.productDetails" 
          label="Product Details" 
          placeholder="Enter details like material, care instructions, etc." 
          :rows="4" 
        />

        <CustomTextarea 
          v-model="newPolicy.shippingAndReturns" 
          label="Shipping & Returns Policy" 
          placeholder="Enter the shipping timeframe and return window..." 
          :rows="4" 
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
            <span v-if="!loading">{{ isEditing ? 'Update Policy' : 'Save Policy' }}</span>
            <LoaderCircle v-else class="w-5 h-5 animate-spin" />
          </button>
        </div>
      </form>
    </CustomModal>

    <!-- Confirm Modal -->
    <ConfirmModal 
      v-model="isConfirmModalOpen"
      title="Delete Policy"
      message="Are you sure you want to delete this policy? This action cannot be undone."
      confirmText="Delete"
      :loading="isDeleting"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Shield, LoaderCircle, Search } from 'lucide-vue-next'
import { usePolicies } from '@/composables/modules/policies/usePolicies'

const { policies, loading, fetchPolicies, createPolicy, updatePolicy, deletePolicy } = usePolicies()

const q = ref('')
const isAddModalOpen = ref(false)
const isEditing = ref(false)
const editingPolicyId = ref(null)
const isConfirmModalOpen = ref(false)
const isDeleting = ref(false)
const policyToDelete = ref(null)

const newPolicy = ref({
  name: '',
  productDetails: '',
  shippingAndReturns: ''
})

onMounted(async () => {
  await fetchPolicies()
})

const columns = [
  { accessorKey: 'name', header: 'Policy Name' },
  { accessorKey: 'actions', header: 'Actions' }
]

const filteredRows = computed(() => {
  if (!policies.value) return []
  if (!q.value) return policies.value
  
  return policies.value.filter((policy) => {
    return policy.name?.toLowerCase().includes(q.value.toLowerCase())
  })
})

const items = (row) => [
  { label: 'Edit', onSelect: () => openEditModal(row) },
  { label: 'Delete', color: 'error', onSelect: () => confirmDelete(row._id) }
]

const openEditModal = (policy) => {
  isEditing.value = true
  editingPolicyId.value = policy._id
  newPolicy.value = {
    name: policy.name,
    productDetails: policy.productDetails,
    shippingAndReturns: policy.shippingAndReturns
  }
  isAddModalOpen.value = true
}

const openAddModal = () => {
  isEditing.value = false
  editingPolicyId.value = null
  newPolicy.value = { name: '', productDetails: '', shippingAndReturns: '' }
  isAddModalOpen.value = true
}

const handleSubmitPolicy = async () => {
  try {
    if (isEditing.value) {
      await updatePolicy(editingPolicyId.value, newPolicy.value)
    } else {
      await createPolicy(newPolicy.value)
    }
    isAddModalOpen.value = false
    newPolicy.value = { name: '', productDetails: '', shippingAndReturns: '' }
  } catch (error) {
    console.error('Failed to save policy', error)
  }
}

const confirmDelete = (id) => {
  policyToDelete.value = id
  isConfirmModalOpen.value = true
}

const handleDeleteConfirm = async () => {
  if (!policyToDelete.value) return
  isDeleting.value = true
  try {
    await deletePolicy(policyToDelete.value)
    isConfirmModalOpen.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isDeleting.value = false
  }
}
</script>
