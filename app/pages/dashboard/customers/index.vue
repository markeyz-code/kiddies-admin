<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Customers</h1>
        <p class="text-gray-500 font-medium">View and manage all registered customers.</p>
      </div>
      <div>
        <UButton color="primary" :loading="loading" @click="fetchCustomers" class="bg-emerald-700 hover:bg-emerald-800">
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Table Header Info -->
    <div class="mb-4">
      <h2 class="text-lg font-bold text-gray-800">
        Customer Records — <span class="font-normal">{{ formattedCustomers.length }} matching records</span>
      </h2>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <UTable :columns="columns" :data="formattedCustomers" :loading="loading" class="min-w-[800px]" :ui="{ th: { base: 'bg-gray-50 text-gray-500 font-bold py-4' }, td: { base: 'py-4 border-b border-gray-100 last:border-0 text-gray-700 font-medium' } }">
          
          <template #id-cell="{ row: { original: row } }">
            <span class="text-emerald-700 font-bold">{{ row.id.slice(0, 8).toUpperCase() }}</span>
          </template>

          <template #actions-cell="{ row: { original: row } }">
            <button @click="openPreviewModal(row)" class="text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors" title="View">
              <Eye class="w-4 h-4" />
            </button>
          </template>

          <template #loading>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500">
              <LoaderCircle class="w-8 h-8 animate-spin mb-4 text-emerald-700" />
              <span class="text-sm font-medium">Loading customers...</span>
            </div>
          </template>
          
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500 font-medium">
              <Inbox class="w-12 h-12 mb-4 text-gray-300" />
              <span class="text-sm font-medium">No customers found.</span>
            </div>
          </template>
        </UTable>
      </div>
      
      
      <CustomModal v-model="isPreviewModalOpen" title="Customer Details" maxWidth="md">
        <div v-if="selectedCustomer" class="space-y-6">
          
          <div class="flex items-center space-x-4 border-b border-gray-100 pb-4">
            <div class="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-2xl">
              {{ selectedCustomer.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-xl font-bold text-gray-900">{{ selectedCustomer.name }}</p>
              <p class="text-gray-500">{{ selectedCustomer.email }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500 mb-1">Customer ID</p>
              <p class="font-medium text-gray-900">{{ selectedCustomer.id }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-1">Joined Date</p>
              <p class="font-medium text-gray-900">{{ selectedCustomer.joined }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-gray-500 mb-1">Registered Address</p>
              <p class="font-medium text-gray-900">{{ selectedCustomer.address || 'No address provided' }}</p>
            </div>
          </div>
          
        </div>
      </CustomModal>

      <!-- Footer Pagination (Mock) -->
      <div v-if="!loading && formattedCustomers.length > 0" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-white">
        <span class="text-sm text-gray-500 font-medium">Showing 1-{{ formattedCustomers.length }} of {{ formattedCustomers.length }} customers</span>
        <div class="flex space-x-2">
          <UButton variant="outline" color="gray" size="sm" class="font-medium">Previous</UButton>
          <UButton color="primary" class="bg-emerald-700 hover:bg-emerald-800 font-medium" size="sm">1</UButton>
          <UButton variant="outline" color="gray" size="sm" class="font-medium">Next</UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { LoaderCircle, Inbox, Eye } from 'lucide-vue-next'
import { useCustomers } from '@/composables/modules/customers/useCustomers'

const { customers, loading, fetchCustomers } = useCustomers()
const isPreviewModalOpen = ref(false)
const selectedCustomer = ref(null)

const openPreviewModal = (customer) => {
  selectedCustomer.value = customer
  isPreviewModalOpen.value = true
}


onMounted(async () => {
    await fetchCustomers()
})

const columns = [
  { accessorKey: 'id', header: 'Customer ID' },
  { accessorKey: 'name', header: 'Full Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'joined', header: 'Joined Date' },
  { accessorKey: 'actions', header: 'Actions' }
]

const formattedCustomers = computed(() => {
  if (!customers.value) return []
  return customers.value.map(customer => ({
    id: customer._id,
    name: `${customer.firstName} ${customer.lastName}`,
    email: customer.email,
    joined: new Date(customer.createdAt).toLocaleDateString(),
    address: customer.address ? `${customer.address}, ${customer.city}, ${customer.country}` : '',
    actions: 'View'
  }))
})
</script>
