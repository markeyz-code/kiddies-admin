<template>
  <div>
    <div class="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      <div>
        <h1 class="text-2xl font-bold">Customers</h1>
        <p class="text-gray-500 font-medium">View and manage all registered customers.</p>
      </div>
      <div>
        <UButton color="primary" :loading="loading" @click="fetchCustomers" class="bg-brand-700 hover:bg-brand-800">
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Table Header Info -->
    <div class="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <h2 class="text-lg font-bold text-gray-800">
        Customer Records — <span class="font-normal">{{ filteredCustomers.length }} matching records</span>
      </h2>
      <input v-model="search" type="search" placeholder="Search customers..." class="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:border-brand-600 w-full sm:w-64" />
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Mobile cards -->
      <div class="md:hidden divide-y divide-gray-100">
        <div v-for="row in filteredCustomers" :key="row.id" class="p-4">
          <div class="flex items-center gap-3">
            <div class="h-11 w-11 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">{{ (row.name || '?').charAt(0).toUpperCase() }}</div>
            <div class="min-w-0 flex-1">
              <p class="font-bold text-gray-900 truncate">{{ row.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ row.email }}</p>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="row.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'">{{ row.role }}</span>
          </div>
          <div class="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Joined {{ row.joined }}</span>
            <span>{{ row.verified ? 'Verified' : 'Unverified' }}</span>
          </div>
          <button @click="openPreviewModal(row)" class="mt-3 w-full inline-flex items-center justify-center gap-2 border border-brand-200 bg-brand-50 text-brand-700 font-bold text-xs py-2.5 rounded-full">
            <Eye class="w-4 h-4" /> View customer & orders
          </button>
        </div>
        <div v-if="!loading && filteredCustomers.length === 0" class="p-10 text-center text-gray-500 text-sm font-medium">No customers found.</div>
      </div>

      <div class="hidden md:block overflow-x-auto">
        <UTable :columns="columns" :data="filteredCustomers" :loading="loading" class="min-w-[800px]" :ui="{ th: { base: 'bg-gray-50 text-gray-500 font-bold py-4' }, td: { base: 'py-4 border-b border-gray-100 last:border-0 text-gray-700 font-medium' } }">
          
          <template #id-cell="{ row: { original: row } }">
            <span class="text-brand-700 font-bold">{{ row.id.slice(0, 8).toUpperCase() }}</span>
          </template>

          <template #actions-cell="{ row: { original: row } }">
            <button @click="openPreviewModal(row)" class="text-brand-700 hover:bg-brand-50 p-1.5 rounded-lg transition-colors" title="View">
              <Eye class="w-4 h-4" />
            </button>
          </template>

          <template #loading>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500">
              <LoaderCircle class="w-8 h-8 animate-spin mb-4 text-brand-700" />
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
            <div class="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-2xl">
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
            <div>
              <p class="text-gray-500 mb-1">Account Type</p>
              <p class="font-medium text-gray-900 capitalize">{{ selectedCustomer.role }}</p>
            </div>
            <div>
              <p class="text-gray-500 mb-1">Email Verified</p>
              <p class="font-medium text-gray-900">{{ selectedCustomer.verified ? 'Yes' : 'No' }}</p>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4">
            <h3 class="font-bold text-gray-800 mb-3">Order History</h3>
            <div v-if="loadingOrders" class="text-sm text-gray-500">Loading orders…</div>
            <div v-else-if="customerOrders.length === 0" class="text-sm text-gray-500">No orders placed yet.</div>
            <div v-else class="space-y-2 max-h-64 overflow-y-auto">
              <div v-for="order in customerOrders" :key="order._id" class="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-sm">
                <div>
                  <p class="font-bold text-gray-900">{{ order.orderNumber }}</p>
                  <p class="text-xs text-gray-500">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900">${{ (order.totalAmount || 0).toFixed(2) }}</p>
                  <p class="text-xs text-gray-500">{{ order.status }} · {{ order.paymentStatus }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      <!-- Footer Pagination (Mock) -->
      <div v-if="!loading && filteredCustomers.length > 0" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-white">
        <span class="text-sm text-gray-500 font-medium">Showing 1-{{ filteredCustomers.length }} of {{ filteredCustomers.length }} customers</span>
        <div class="flex space-x-2">
          <UButton variant="outline" color="gray" size="sm" class="font-medium">Previous</UButton>
          <UButton color="primary" class="bg-brand-700 hover:bg-brand-800 font-medium" size="sm">1</UButton>
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
import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

const search = ref('')
const customerOrders = ref([])
const loadingOrders = ref(false)

const { customers, loading, fetchCustomers } = useCustomers()
const isPreviewModalOpen = ref(false)
const selectedCustomer = ref(null)

const openPreviewModal = async (customer) => {
  selectedCustomer.value = customer
  customerOrders.value = []
  isPreviewModalOpen.value = true
  loadingOrders.value = true
  try {
    const { data } = await GATEWAY_ENDPOINT_WITH_AUTH.get('/orders', { params: { search: customer.email, limit: 50 } })
    customerOrders.value = data.orders || []
  } catch (error) {
    console.error('Failed to load customer orders', error)
  } finally {
    loadingOrders.value = false
  }
}

const filteredCustomers = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return formattedCustomers.value
  return formattedCustomers.value.filter((c) =>
    [c.name, c.email, c.phone].join(' ').toLowerCase().includes(term)
  )
})


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
    name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unnamed customer',
    email: customer.email,
    phone: customer.phoneNumber || '',
    joined: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—',
    role: customer.role || 'customer',
    verified: !!customer.isEmailVerified,
    address: customer.addresses?.length
      ? `${customer.addresses[0].street || ''}, ${customer.addresses[0].city || ''}, ${customer.addresses[0].country || ''}`
      : '',
    actions: 'View'
  }))
})
</script>
