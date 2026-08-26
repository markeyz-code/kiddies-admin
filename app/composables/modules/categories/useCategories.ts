import { ref } from 'vue'
import { rawBaseUrl } from '@/api_factory/axios.config'

export const useCategories = () => {
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // API base URL
  const API_URL = `${rawBaseUrl}/categories`

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      categories.value = data
    } catch (err) {
      error.value = err.message
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (categoryData) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      })
      if (!response.ok) throw new Error('Failed to create category')
      const newCategory = await response.json()
      categories.value.push(newCategory)
      return newCategory
    } catch (err) {
      error.value = err.message
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id, categoryData) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      })
      if (!response.ok) throw new Error('Failed to update category')
      const updatedCategory = await response.json()
      const index = categories.value.findIndex(c => c._id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
      return updatedCategory
    } catch (err) {
      error.value = err.message
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete category')
      categories.value = categories.value.filter(c => c._id !== id)
    } catch (err) {
      error.value = err.message
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
