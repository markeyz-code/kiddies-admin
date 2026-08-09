
<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-200 pb-4 sm:pb-6">
      <div>
        <h1 class="text-xl sm:text-3xl font-bold text-gray-900 mb-1">Enterprise Dashboard</h1>
        <p class="text-gray-500 font-medium flex items-center text-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
          Core Status: Connected
        </p>
      </div>
      <div class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
        <p class="text-gray-900 font-medium mr-2 sm:mr-4 text-sm hidden sm:block">Welcome back, <span class="text-emerald-700 font-bold">Admin</span></p>
        <button @click="generateReport" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-4 sm:py-2.5 sm:px-5 rounded-full transition-colors text-xs sm:text-sm shadow-sm flex items-center flex-shrink-0">
          Generate Report
        </button>
      </div>
    </div>

    <!-- Executive KPI Summary -->
    <div>
      <h2 class="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Executive KPI Summary</h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-bold text-gray-500 text-sm">Total Revenue</h3>
              <DollarSign class="w-5 h-5 text-gray-400" />
            </div>
            <div class="text-xl sm:text-3xl font-bold text-gray-900 mb-2" v-if="!loading">₦{{ (analytics?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
            <div v-else class="h-9 w-32 bg-gray-100 rounded animate-pulse mb-2"></div>
          </div>
          <div class="flex items-center text-xs font-bold mt-2">
            <span class="text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded mr-2"><ArrowUp class="w-3 h-3 mr-1"/> 12.5%</span>
            <span class="text-gray-400">vs last month</span>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div>
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-bold text-gray-500 text-sm">Estimated Profit</h3>
              <TrendingUp class="w-5 h-5 text-gray-400" />
            </div>
            <div class="text-xl sm:text-3xl font-bold text-emerald-700 mb-2" v-if="!loading">₦{{ (analytics?.totalProfit || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
            <div v-else class="h-9 w-32 bg-gray-100 rounded animate-pulse mb-2"></div>
          </div>
          <div class="flex items-center text-xs font-bold mt-2">
            <span class="text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded mr-2"><ArrowUp class="w-3 h-3 mr-1"/> 15.2%</span>
            <span class="text-gray-400">vs last month</span>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-bold text-gray-500 text-sm">Total Orders</h3>
              <Package class="w-5 h-5 text-gray-400" />
            </div>
            <div class="text-xl sm:text-3xl font-bold text-gray-900 mb-2" v-if="!loading">{{ analytics?.totalOrders || 0 }}</div>
            <div v-else class="h-9 w-20 bg-gray-100 rounded animate-pulse mb-2"></div>
          </div>
          <div class="flex items-center text-xs font-bold mt-2">
            <span class="text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded mr-2"><ArrowUp class="w-3 h-3 mr-1"/> 8.3%</span>
            <span class="text-gray-400">vs last month</span>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-bold text-gray-500 text-sm">Avg Order Value</h3>
              <BarChart3 class="w-5 h-5 text-gray-400" />
            </div>
            <div class="text-xl sm:text-3xl font-bold text-gray-900 mb-2" v-if="!loading">₦{{ (analytics?.averageOrderValue || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</div>
            <div v-else class="h-9 w-32 bg-gray-100 rounded animate-pulse mb-2"></div>
          </div>
          <div class="flex items-center text-xs font-bold mt-2">
            <span class="text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded mr-2"><ArrowUp class="w-3 h-3 mr-1"/> 5.7%</span>
            <span class="text-gray-400">vs last month</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Insights Section (Top Products & Chat Trends) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
      <!-- Top Sold Products -->
      <div>
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Star class="w-5 h-5 mr-2 text-yellow-500" /> Highly Sold Products
        </h2>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ul class="divide-y divide-gray-200">
            <li v-for="(product, idx) in topProducts" :key="idx" class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  #{{ idx + 1 }}
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm">{{ product.name }}</h4>
                  <p class="text-xs text-gray-500">SKU: {{ product.sku }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-900 text-sm">{{ product.quantity }} sold</p>
                <p class="text-xs text-emerald-600 font-medium">₦{{ product.revenue.toLocaleString() }}</p>
              </div>
            </li>
            <li v-if="topProducts.length === 0" class="p-8 text-center text-gray-500 font-medium text-sm">
              No sales data available yet.
            </li>
          </ul>
        </div>
      </div>

      <!-- Chat Analytics / Trending Insights -->
      <div>
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <MessageSquareText class="w-5 h-5 mr-2 text-blue-500" /> Customer Insights (Chat)
        </h2>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="mb-6 flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Chat Inquiries</p>
              <h3 class="text-2xl font-bold text-gray-900" v-if="!chatLoading">{{ chatAnalytics?.totalMessages || 0 }}</h3>
              <div v-else class="h-8 w-16 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div class="bg-blue-50 p-3 rounded-full">
              <MessageCircle class="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p class="text-sm font-bold text-gray-800 mb-3">Trending Topics & Products</p>
            <div class="flex flex-wrap gap-2" v-if="!chatLoading && chatAnalytics?.trendingKeywords">
              <span 
                v-for="(kw, idx) in chatAnalytics.trendingKeywords" 
                :key="idx"
                class="px-3 py-1 rounded-full text-xs font-bold"
                :class="idx < 2 ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-gray-100 text-gray-700'"
              >
                {{ kw.word }} ({{ kw.count }})
              </span>
            </div>
            <div v-else-if="chatLoading" class="flex flex-wrap gap-2">
              <div v-for="i in 5" :key="i" class="h-6 w-20 bg-gray-100 rounded-full animate-pulse"></div>
            </div>
            <div v-else class="text-sm text-gray-500">No chat data available.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Table -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold text-gray-800">
          Recent Transactions
        </h2>
        <NuxtLink to="/dashboard/orders" class="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center">
          View All Orders <ArrowRight class="w-4 h-4 ml-1" />
        </NuxtLink>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <UTable :columns="transactionColumns" :data="recentTransactions" :loading="loading" class="min-w-[800px]" :ui="{ th: { base: 'bg-gray-50 text-gray-500 font-bold py-4 border-b border-gray-200' }, td: { base: 'py-4 border-b border-gray-100 last:border-0 text-gray-700 font-medium' } }">
            <template #order-cell="{ row: { original: row } }">
              <span class="font-bold text-emerald-700">{{ row.orderNumber }}</span>
            </template>
            <template #customer-cell="{ row: { original: row } }">
              <div>
                <p class="font-bold text-gray-900">{{ row.customer?.firstName }} {{ row.customer?.lastName }}</p>
                <p class="text-xs text-gray-500">{{ row.customer?.email }}</p>
              </div>
            </template>
            <template #amount-cell="{ row: { original: row } }">
              <span class="font-bold text-gray-900">₦{{ row.totalAmount.toLocaleString() }}</span>
            </template>
            <template #status-cell="{ row: { original: row } }">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold" :class="getStatusClass(row.status)">
                {{ row.status }}
              </span>
            </template>
            <template #date-cell="{ row: { original: row } }">
              <span class="text-gray-500 text-sm font-medium">{{ new Date(row.createdAt).toLocaleDateString() }}</span>
            </template>
            <template #empty-state>
              <div class="flex flex-col items-center justify-center py-12 text-gray-500 font-medium">
                <Inbox class="w-12 h-12 mb-4 text-gray-300" />
                <span class="text-sm font-medium">No recent transactions found.</span>
              </div>
            </template>
          </UTable>
        </div>
      </div>
    </div>

    <!-- Recent Activity (Audit) Table -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold text-gray-800">
          System Activity Log <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">Live</span>
        </h2>
        <NuxtLink to="/dashboard/audit-logs" class="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center">
          View Audit Trail <ArrowRight class="w-4 h-4 ml-1" />
        </NuxtLink>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <UTable :columns="activityColumns" :data="recentActivities" :loading="loading" class="min-w-[800px]" :ui="{ th: { base: 'bg-gray-50 text-gray-500 font-bold py-4 border-b border-gray-200' }, td: { base: 'py-4 border-b border-gray-100 last:border-0 text-gray-700 font-medium' } }">
            
            <template #action-cell="{ row: { original: row } }">
              <span class="px-3 py-1 rounded-full text-xs font-bold" :class="getActionClass(row.action)">
                {{ formatAction(row.action) }}
              </span>
            </template>

            <template #user-cell="{ row: { original: row } }">
              <span class="font-bold text-gray-900">{{ row.user }}</span>
            </template>

            <template #details-cell="{ row: { original: row } }">
              <div class="text-sm max-w-xs truncate text-gray-600" :title="row.details">
                {{ row.details }}
              </div>
            </template>

            <template #timestamp-cell="{ row: { original: row } }">
              <span class="text-gray-500 text-sm font-medium">{{ row.timestamp }}</span>
            </template>

            <template #loading>
              <div class="flex flex-col items-center justify-center py-12 text-gray-500">
                <LoaderCircle class="w-8 h-8 animate-spin mb-4 text-emerald-700" />
                <span class="text-sm font-medium">Loading activity...</span>
              </div>
            </template>
            
            <template #empty-state>
              <div class="flex flex-col items-center justify-center py-12 text-gray-500 font-medium">
                <Inbox class="w-12 h-12 mb-4 text-gray-300" />
                <span class="text-sm font-medium">No recent activities found.</span>
              </div>
            </template>
          </UTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { LoaderCircle, Inbox, DollarSign, Package, BarChart3, ArrowUp, TrendingUp, Star, MessageSquareText, MessageCircle, Users, PackagePlus, ShoppingCart, MessageSquare, ArrowRight } from 'lucide-vue-next'
import { useOrders } from '@/composables/modules/orders/useOrders'
import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

const toast = useToast()

const activityColumns = [
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'details', header: 'Details' },
  { accessorKey: 'timestamp', header: 'Time' }
]

const transactionColumns = [
  { accessorKey: 'order', header: 'Order ID' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'amount', header: 'Amount' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'date', header: 'Date' }
]

const { analytics, loading, fetchAnalytics } = useOrders()
const chatAnalytics = ref(null)
const chatLoading = ref(true)

const fetchChatAnalytics = async () => {
  try {
    chatLoading.value = true
    const response = await GATEWAY_ENDPOINT_WITH_AUTH.get('/chat/analytics')
    chatAnalytics.value = response.data
  } catch (error) {
    console.error('Failed to fetch chat analytics', error)
  } finally {
    chatLoading.value = false
  }
}

onMounted(async () => {
  await fetchAnalytics()
  await fetchChatAnalytics()
})

const topProducts = computed(() => {
  if (!analytics.value || !analytics.value.topSoldProducts) return []
  return analytics.value.topSoldProducts
})

const recentTransactions = computed(() => {
  if (!analytics.value || !analytics.value.recentTransactions) return []
  return analytics.value.recentTransactions
})

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'bg-emerald-100 text-emerald-800'
    case 'shipped': return 'bg-blue-100 text-blue-800'
    case 'processing': return 'bg-orange-100 text-orange-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getActionClass = (action) => {
  if (!action) return 'bg-gray-100 text-gray-700'
  if (action.includes('Created')) return 'bg-emerald-100 text-emerald-700'
  if (action.includes('Updated')) return 'bg-blue-100 text-blue-700'
  if (action.includes('Deleted') || action.includes('Cancelled')) return 'bg-red-100 text-red-700'
  return 'bg-gray-100 text-gray-700'
}

const formatAction = (action) => {
  return action || 'Unknown'
}

const recentActivities = computed(() => {
  if (!analytics.value || !analytics.value.recentActivities) return []
  return analytics.value.recentActivities.map(log => {
    let detailsString = '-'
    if (log.details) {
      if (log.details.productName) {
        detailsString = `${log.details.productName} in ${log.details.category || 'catalog'}`
      } else if (log.details.orderId) {
        detailsString = `Order ${log.details.orderId} marked as ${log.details.status}`
      } else if (log.details.policyName) {
        detailsString = `Policy: ${log.details.policyName}`
      } else {
        detailsString = Object.values(log.details).join(', ')
      }
    }
    
    return {
      action: log.action,
      user: log.user ? `${log.user.firstName || ''} ${log.user.lastName || ''}`.trim() || log.user.email || 'Admin' : 'Admin',
      details: detailsString,
      timestamp: new Date(log.createdAt).toLocaleString(),
      rawDate: log.createdAt
    }
  })
})

const generateReport = () => {
  toast.add({
    title: 'Report Generated',
    description: 'Dashboard report has been sent to your email.',
    color: 'emerald'
  })
}
</script>
