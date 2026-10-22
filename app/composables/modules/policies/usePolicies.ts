import { ref } from 'vue'
import { policiesApi } from '@/api_factory/modules/policies'

export const usePolicies = () => {
  const policies = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchPolicies = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await policiesApi.getPolicies()
      policies.value = data
      return data
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }

  const createPolicy = async (policyData: any) => {
    loading.value = true
    try {
      const { data } = await policiesApi.createPolicy(policyData)
      policies.value.push(data)
      return data
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePolicy = async (id: string, policyData: any) => {
    loading.value = true
    try {
      const { data } = await policiesApi.updatePolicy(id, policyData)
      const index = policies.value.findIndex((p) => p._id === id)
      if (index !== -1) policies.value[index] = data
      return data
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePolicy = async (id: string) => {
    loading.value = true
    try {
      await policiesApi.deletePolicy(id)
      policies.value = policies.value.filter((p) => p._id !== id)
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return { policies, loading, error, fetchPolicies, createPolicy, updatePolicy, deletePolicy }
}
