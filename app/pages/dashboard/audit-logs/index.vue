<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">Audit Logs</h1>
        <p class="text-gray-500 font-medium">Track user interactions and purchases</p>
      </div>
    </div>

    <div class="mb-4">
      <h2 class="text-lg font-bold text-gray-800">
        System Activity — <span class="font-normal">{{ filteredRows.length }} records</span>
      </h2>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="flex px-6 py-4 border-b border-gray-200 bg-gray-50">
        <CustomInput v-model="q" placeholder="Search logs..." class="w-72">
          <template #leading>
            <Search class="w-4 h-4 text-gray-400" />
          </template>
        </CustomInput>
      </div>
      <div class="overflow-x-auto">
        <UTable :columns="columns" :data="filteredRows" :loading="loading" class="min-w-[800px]" :ui="{ th: { base: 'bg-white text-gray-500 font-bold py-4 border-b border-gray-200' }, td: { base: 'py-4 border-b border-gray-100 last:border-0 text-gray-700 font-medium align-middle' } }">
          
          <template #action-cell="{ row: { original: row } }">
            <span class="px-3 py-1 rounded-full text-xs font-bold" :class="getActionClass(row.action)">
              {{ formatAction(row.action) }}
            </span>
          </template>

          <template #user-cell="{ row: { original: row } }">
            <div>
              <p class="font-bold text-gray-900">{{ row.user ? `${row.user.firstName || ''} ${row.user.lastName || ''}`.trim() || row.user.email || 'Admin' : 'Admin' }}</p>
              <p class="text-xs text-gray-500">{{ row.user?.email || '' }}</p>
            </div>
          </template>
          
          <template #details-cell="{ row: { original: row } }">
             <div class="text-sm max-w-xs truncate" :title="JSON.stringify(row.details)">
               {{ formatDetails(row.details) }}
             </div>
          </template>

          <template #timestamp-cell="{ row: { original: row } }">
             <div class="text-sm text-gray-500">
               {{ new Date(row.createdAt).toLocaleString() }}
             </div>
          </template>

          <template #loading>
            <div class="space-y-4 py-4">
              <div v-for="i in 5" :key="i" class="flex animate-pulse space-x-4 px-6 items-center">
                <div class="h-6 w-24 bg-gray-200 rounded-full"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div class="h-3 w-1/2 bg-gray-100 rounded"></div>
                </div>
                <div class="h-4 w-32 bg-gray-200 rounded"></div>
                <div class="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </template>
          
          <template #empty>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500 font-medium">
              <Activity class="w-12 h-12 mb-4 text-gray-300" />
              <span class="text-sm font-medium">No activity logged yet.</span>
            </div>
          </template>
        
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500 font-medium">
              <Inbox class="w-12 h-12 mb-4 text-gray-300" />
              <span class="text-sm font-medium">No audit logs found.</span>
            </div>
          </template>
        </UTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Activity, LoaderCircle, Search } from 'lucide-vue-next'
import { useAuditLogs } from '@/composables/modules/audit/useAuditLogs'

const { auditLogs, loading, fetchAuditLogs } = useAuditLogs()

const q = ref('')

onMounted(async () => {
  await fetchAuditLogs()
})

const columns = [
  { accessorKey: 'action', header: 'Action' },
  { accessorKey: 'user', header: 'User' },
  { accessorKey: 'details', header: 'Details' },
  { accessorKey: 'timestamp', header: 'Timestamp' }
]

const filteredRows = computed(() => {
  if (!auditLogs.value) return []
  if (!q.value) return auditLogs.value
  
  return auditLogs.value.filter((log) => {
     const searchStr = q.value.toLowerCase()
     const actionMatch = log.action?.toLowerCase().includes(searchStr)
     const userMatch = log.user && (`${log.user.firstName} ${log.user.lastName}`.toLowerCase().includes(searchStr) || log.user.email?.toLowerCase().includes(searchStr))
     const detailsMatch = log.details && JSON.stringify(log.details).toLowerCase().includes(searchStr)
     return actionMatch || userMatch || detailsMatch
  })
})

const getActionClass = (action) => {
  if (!action) return 'bg-gray-100 text-gray-700'
  if (action.includes('Created')) return 'bg-emerald-100 text-emerald-700'
  if (action.includes('Updated')) return 'bg-blue-100 text-blue-700'
  if (action.includes('Deleted') || action.includes('Cancelled')) return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}

const formatAction = (action) => {
  return action || 'Unknown'
}

const formatDetails = (details) => {
  if (!details) return '-'
  if (details.productName) {
    return `${details.productName} in ${details.category || 'catalog'}`
  } else if (details.orderId) {
    return `Order ${details.orderId} marked as ${details.status}`
  } else if (details.policyName) {
    return `Policy: ${details.policyName}`
  }
  return Object.values(details).join(', ')
}
</script>
