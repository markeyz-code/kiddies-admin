import { ref } from 'vue'
import { categoriesApi } from '@/api_factory/modules/categories'
import { useToast } from '#imports'

export const useCategories = () => {
  const categories = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await categoriesApi.getCategories()
      categories.value = data
      return data
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message
      console.error(err)
      return []
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (categoryData: any) => {
    loading.value = true
    try {
      const { data } = await categoriesApi.createCategory(categoryData)
      categories.value.push(data)
      return data
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: string, categoryData: any) => {
    loading.value = true
    try {
      const { data } = await categoriesApi.updateCategory(id, categoryData)
      const index = categories.value.findIndex((c) => c._id === id)
      if (index !== -1) categories.value[index] = data
      return data
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: string) => {
    loading.value = true
    try {
      await categoriesApi.deleteCategory(id)
      categories.value = categories.value.filter((c) => c._id !== id)
    } catch (err: any) {
      error.value = err?.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory }
}
