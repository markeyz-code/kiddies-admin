import { ref } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

export const useAuditLogs = () => {
  const auditLogs = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchAuditLogs = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await GATEWAY_ENDPOINT_WITH_AUTH.get('/audit-logs')
      auditLogs.value = response.data
    } catch (err) {
      error.value = err.message
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  return {
    auditLogs,
    loading,
    error,
    fetchAuditLogs
  }
}
