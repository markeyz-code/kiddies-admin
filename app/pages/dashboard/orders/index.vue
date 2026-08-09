<template>
  <div>
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Transactions</h1>
        <p class="text-gray-500 font-medium">View and manage all customer orders.</p>
      </div>
      <div>
        <UButton color="primary" :loading="loading" @click="fetchOrders" class="bg-emerald-700 hover:bg-emerald-800">
          Refresh
        </UButton>
      </div>
    </div>

    <!-- Table Header Info -->
    <div class="mb-4">
      <h2 class="text-lg font-bold text-gray-800">
        Transaction Records — <span class="font-normal">{{ formattedOrders.length }} matching records</span>
      </h2>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <UTable :columns="columns" :data="formattedOrders" :loading="loading" class="min-w-[800px]" :ui="{ th: { base: 'bg-gray-50 text-gray-500 font-bold py-4' }, td: { base: 'py-4 border-b border-gray-100 last:border-0 text-gray-700 font-medium' } }">
          
          <template #orderNumber-cell="{ row: { original: row } }">
            <span class="text-emerald-700 font-bold">{{ row.orderNumber }}</span>
          </template>

          <template #status-cell="{ row: { original: row } }">
            <span v-if="row.status === 'Completed' || row.status === 'Delivered'" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Active</span>
            <span v-else-if="row.status === 'Pending'" class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Pending</span>
            <span v-else class="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">{{ row.status }}</span>
          </template>

          <template #actions-cell="{ row: { original: row } }">
            <button @click="openPreviewModal(row)" class="text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors" title="View">
              <Eye class="w-4 h-4" />
            </button>
          </template>

          <template #loading>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500">
              <LoaderCircle class="w-8 h-8 animate-spin mb-4 text-emerald-700" />
              <span class="text-sm font-medium">Loading orders...</span>
            </div>
          </template>
          
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500 font-medium">
              <Inbox class="w-12 h-12 mb-4 text-gray-300" />
              <span class="text-sm font-medium">No transactions found.</span>
            </div>
          </template>
        </UTable>
      </div>

      
      <CustomModal v-model="isPreviewModalOpen" title="Order Details" maxWidth="2xl">
        <div v-if="selectedOrder" class="space-y-6">
          <div class="flex justify-between items-start border-b border-gray-100 pb-4">
            <div>
              <p class="text-sm text-gray-500 font-medium">Order Number</p>
              <p class="text-lg font-bold text-gray-900">{{ selectedOrder.orderNumber }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ selectedOrder.date }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500 font-medium">Current Status</p>
              <span class="px-3 py-1 mt-1 inline-block rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">{{ selectedOrder.status }}</span>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-2">Customer Details</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Name</p>
                <p class="font-medium text-gray-900">{{ selectedOrder.customer }}</p>
              </div>
              <div>
                <p class="text-gray-500">Email</p>
                <p class="font-medium text-gray-900">{{ selectedOrder.email }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-gray-500">Address</p>
                <p class="font-medium text-gray-900">{{ selectedOrder.fullAddress }}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-bold text-gray-800 mb-3">Order Items</h3>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <table class="w-full text-sm text-left">
                <thead class="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-2">Item</th>
                    <th class="px-4 py-2">SKU</th>
                    <th class="px-4 py-2 text-center">Qty</th>
                    <th class="px-4 py-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 text-gray-700 font-medium">
                  <tr v-for="item in selectedOrder.items" :key="item.sku">
                    <td class="px-4 py-3">{{ item.name }}</td>
                    <td class="px-4 py-3">{{ item.sku }}</td>
                    <td class="px-4 py-3 text-center">{{ item.quantity }}</td>
                    <td class="px-4 py-3 text-right">₦{{ (item.price || 0).toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="flex justify-end pt-4 border-t border-gray-100">
            <div class="w-1/2 space-y-2 text-sm">
              <div class="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span class="font-medium text-gray-900">₦{{ (selectedOrder.subtotal || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span class="font-medium text-gray-900">₦{{ (selectedOrder.shippingFee || 0).toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₦{{ (selectedOrder.totalAmount || 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>
          
          <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mt-6">
            <h3 class="font-bold text-emerald-800 mb-3">Update Order Status</h3>
            <div class="flex items-end gap-3">
              <div class="flex-1">
                <CustomSelect 
                  v-model="newStatus" 
                  label="New Status" 
                  :options="[
                    {label:'Pending',value:'Pending'},
                    {label:'Processing',value:'Processing'},
                    {label:'Shipped',value:'Shipped'},
                    {label:'Delivered',value:'Delivered'},
                    {label:'Cancelled',value:'Cancelled'}
                  ]" 
                />
              </div>
              <UButton @click="handleUpdateStatus" :loading="updatingStatus" color="primary" class="bg-emerald-700 hover:bg-emerald-800 h-[42px] px-6">
                Update Status
              </UButton>
            </div>
          </div>
        </div>
      </CustomModal>

      <!-- Footer Pagination (Mock) -->
      <div v-if="!loading && formattedOrders.length > 0" class="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-white">
        <span class="text-sm text-gray-500 font-medium">Showing 1-{{ formattedOrders.length }} of {{ formattedOrders.length }} transactions</span>
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
import { useOrders } from '@/composables/modules/orders/useOrders'

const { orders, loading, fetchOrders, updateOrderStatus } = useOrders()
const isPreviewModalOpen = ref(false)
const selectedOrder = ref(null)
const newStatus = ref('')
const updatingStatus = ref(false)
const toast = useToast()

const openPreviewModal = (order) => {
  selectedOrder.value = order
  newStatus.value = order.status || 'Pending'
  isPreviewModalOpen.value = true
}

const handleUpdateStatus = async () => {
  if (!selectedOrder.value) return
  updatingStatus.value = true
  try {
    await updateOrderStatus(selectedOrder.value._id, newStatus.value)
    toast.add({ title: 'Success', description: 'Order status updated', color: 'emerald' })
    await fetchOrders()
    isPreviewModalOpen.value = false
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to update status', color: 'red' })
  } finally {
    updatingStatus.value = false
  }
}


onMounted(async () => {
    await fetchOrders()
})

const columns = [
  { accessorKey: 'orderNumber', header: 'Transaction ID' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'total', header: 'Total' },
  { accessorKey: 'status', header: 'Account Status' },
  { accessorKey: 'actions', header: 'Actions' }
]

const formattedOrders = computed(() => {
  if (!orders.value) return []
  return orders.value.map(order => ({
    _id: order._id,
    orderNumber: order.orderNumber,
    items: order.items || [],
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    totalAmount: order.totalAmount,
    fullAddress: order.customer ? `${order.customer.address}, ${order.customer.city}, ${order.customer.country} ${order.customer.zipCode}` : 'N/A',
    customer: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : 'Guest',
    email: order.customer?.email || 'N/A',
    date: new Date(order.createdAt).toLocaleDateString(),
    total: `₦${(order.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    status: order.status || 'Pending',
    actions: 'View'
  }))
})
</script>
