import { ref } from 'vue'
import { rawBaseUrl } from '@/api_factory/axios.config'

export const usePolicies = () => {
  const policies = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const API_URL = `${rawBaseUrl}/product-policies`

  const fetchPolicies = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch policies')
      const data = await response.json()
      policies.value = data
    } catch (err) {
      error.value = err.message
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createPolicy = async (policyData) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData)
      })
      if (!response.ok) throw new Error('Failed to create policy')
      const newPolicy = await response.json()
      policies.value.push(newPolicy)
      return newPolicy
    } catch (err) {
      error.value = err.message
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deletePolicy = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete policy')
      policies.value = policies.value.filter(p => p._id !== id)
    } catch (err) {
      error.value = err.message
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  
  const updatePolicy = async (id, policyData) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData)
      })
      if (!response.ok) throw new Error('Failed to update policy')
      const updatedPolicy = await response.json()
      
      const index = policies.value.findIndex(p => p._id === id)
      if (index !== -1) {
        policies.value[index] = updatedPolicy
      }
      return updatedPolicy
    } catch (err) {
      error.value = err.message
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    policies,
    loading,
    error,
    fetchPolicies,
    createPolicy,
    deletePolicy,
    updatePolicy
  }
}
