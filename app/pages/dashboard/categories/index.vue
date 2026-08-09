<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold">Categories</h1>
        <p class="text-gray-500 font-medium">Manage product categories</p>
      </div>
      <button 
        @click="isEditing = false; newCategory = { name: '', description: '', status: 'active' }; isAddModalOpen = true"
        class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-full transition-colors text-sm shadow-sm flex items-center"
      >
        Add Category
      </button>
    </div>

    <!-- Table Header Info -->
    <div class="mb-4">
      <h2 class="text-lg font-bold text-gray-800">
        Category Records — <span class="font-normal">{{ filteredRows.length }} matching records</span>
      </h2>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="flex px-6 py-4 border-b border-gray-200 bg-gray-50">
        <CustomInput v-model="q" placeholder="Search categories..." class="w-72">
          <template #leading>
            <Search class="w-4 h-4 text-gray-400" />
          </template>
        </CustomInput>
      </div>
      <div class="overflow-x-auto">
        <UTable :columns="columns" :data="filteredRows" :loading="loading" class="min-w-[800px]" :ui="{ th: { base: 'bg-white text-gray-500 font-bold py-4 border-b border-gray-200' }, td: { base: 'py-4 border-b border-gray-100 last:border-0 text-gray-700 font-medium align-middle' } }">
          
          <template #name-cell="{ row: { original: row } }">
            <div>
              <p class="font-bold text-gray-900">{{ row.name }}</p>
              <p class="text-xs text-gray-500">{{ row.description }}</p>
            </div>
          </template>

          <template #loading>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500">
              <LoaderCircle class="w-8 h-8 animate-spin mb-4 text-emerald-700" />
              <span class="text-sm font-medium">Loading categories...</span>
            </div>
          </template>
          
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500 font-medium">
              <Inbox class="w-12 h-12 mb-4 text-gray-300" />
              <span class="text-sm font-medium">No categories found.</span>
            </div>
          </template>
          
          <template #status-cell="{ row: { original: row } }">
            <span v-if="row.status === 'active'" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Active</span>
            <span v-else-if="row.status === 'archived'" class="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">Archived</span>
            <span v-else class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 capitalize">{{ row.status || 'Unknown' }}</span>
          </template>
          
          <template #actions-cell="{ row: { original: row } }">
            <div class="flex items-center space-x-2">
              <button class="text-emerald-700 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors" @click="openEditModal(row)" title="Edit">
                <Pencil class="w-4 h-4" />
              </button>
              <button class="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors" @click="handleDelete(row._id)" title="Delete">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </template>
        </UTable>
      </div>
      
      <!-- Pagination (Placeholder) -->
      <div class="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
        <div>Showing <span class="font-medium text-gray-900">1</span> to <span class="font-medium text-gray-900">{{ categories.length }}</span> of <span class="font-medium text-gray-900">{{ categories.length }}</span> results</div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
          <button class="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Delete Category"
      message="Are you sure you want to delete this category? This action cannot be undone."
      confirm-text="Delete"
      @confirm="executeDelete"
    />

    <!-- Add Category Modal -->
    <CustomModal v-model="isAddModalOpen" :title="isEditing ? 'Edit Category' : 'Add New Category'" maxWidth="2xl">
      <form @submit.prevent="handleSaveCategory" class="space-y-5">
        <CustomInput 
          v-model="newCategory.name" 
          label="Category Name" 
          placeholder="e.g. Dresses" 
          required
        >
          <template #leading>
            <Tag class="w-5 h-5 text-gray-400" />
          </template>
        </CustomInput>
        
        <CustomTextarea 
          v-model="newCategory.description" 
          label="Description" 
          placeholder="Detailed description..." 
          :rows="3" 
        />
        
        <CustomSelect 
          v-model="newCategory.status" 
          label="Status" 
          :options="[{ label: 'Active', value: 'active' }, { label: 'Archived', value: 'archived' }]" 
        />

        <div class="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            @click="isAddModalOpen = false" 
            class="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-full transition-colors flex items-center justify-center min-w-[120px]"
            :disabled="loading"
          >
            <span v-if="!loading">{{ isEditing ? 'Update Category' : 'Save Category' }}</span>
            <LoaderCircle v-else class="w-5 h-5 animate-spin" />
          </button>
        </div>
      </form>
    </CustomModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Tag, LoaderCircle, Inbox, Search, Pencil, Trash2 } from 'lucide-vue-next'
import { useCategories } from '@/composables/modules/categories/useCategories'

const { categories, loading, fetchCategories, createCategory, deleteCategory } = useCategories()
const toast = useToast()

const q = ref('')
const isAddModalOpen = ref(false)
const isEditing = ref(false)
const categoryToEdit = ref(null)
const showDeleteConfirm = ref(false)
const categoryToDelete = ref(null)

const newCategory = ref({
  name: '',
  description: '',
  status: 'active'
})

onMounted(async () => {
  await fetchCategories()
})

const columns = [
  { accessorKey: 'name', header: 'Category Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'actions', header: 'Actions' }
]

const filteredRows = computed(() => {
  if (!categories.value) return []
  if (!q.value) return categories.value
  
  return categories.value.filter((cat) => 
    (cat.name || '').toLowerCase().includes(q.value.toLowerCase()) || 
    (cat.description || '').toLowerCase().includes(q.value.toLowerCase())
  )
})

const handleSaveCategory = async () => {
  try {
    if (isEditing.value && categoryToEdit.value) {
      await productsApi.updateCategory(categoryToEdit.value, newCategory.value)
      toast.add({ title: 'Success', description: 'Category updated successfully', color: 'emerald' })
    } else {
      await createCategory(newCategory.value)
      toast.add({ title: 'Success', description: 'Category created successfully', color: 'emerald' })
    }
    await fetchCategories()
    isAddModalOpen.value = false
    isEditing.value = false
    categoryToEdit.value = null
    newCategory.value = { name: '', description: '', status: 'active' }
  } catch (error) {
    console.error('Failed to save category', error)
    toast.add({ title: 'Error', description: error.message || 'Failed to save category', color: 'red' })
  }
}


const openEditModal = (category) => {
  isEditing.value = true
  categoryToEdit.value = category._id
  newCategory.value = { 
    name: category.name, 
    description: category.description || '', 
    status: category.status || 'active' 
  }
  isAddModalOpen.value = true
}

const handleDelete = (id) => {
  categoryToDelete.value = id
  showDeleteConfirm.value = true
}

const executeDelete = async () => {
  if (!categoryToDelete.value) return
  
  try {
    await deleteCategory(categoryToDelete.value)
    showDeleteConfirm.value = false
    categoryToDelete.value = null
    toast.add({
      title: 'Success',
      description: 'Category deleted successfully',
      color: 'emerald'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete category',
      color: 'red'
    })
  }
}
</script>
