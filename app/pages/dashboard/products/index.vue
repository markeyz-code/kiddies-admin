<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
      <div>
        <h1 class="text-2xl font-bold">Products</h1>
        <p class="text-gray-500 font-medium">Manage your store's catalog</p>
      </div>
      <button class="whitespace-nowrap bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-full transition-colors" @click="isEditing = false; productToEdit = null; newProduct = emptyProduct(); isAddModalOpen = true">Add Product</button>
    </div>

    <!-- Table Header Info -->
    <div class="mb-4">
      <h2 class="text-lg font-bold text-gray-800">
        Product Records — <span class="font-normal">{{ filteredRows.length }} matching records</span>
      </h2>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="flex px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50">
        <UInput v-model="q" placeholder="Search products..." class="w-full sm:w-72" size="lg" :ui="{ rounded: 'rounded-full' }">
          <template #leading>
            <Search class="w-4 h-4 text-gray-400" />
          </template>
        </UInput>
      </div>
      <!-- Mobile cards -->
      <div class="md:hidden divide-y divide-gray-100">
        <div v-for="row in filteredRows" :key="row._id" class="p-4 flex gap-3">
          <div class="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
            <img v-if="productImage(row)" :src="productImage(row)" :alt="row.name" class="h-full w-full object-cover" />
            <Package v-else class="w-6 h-6 text-gray-400" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-gray-900 leading-snug">{{ row.name }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ row.category ? `${row.sku} · ${row.category}` : row.sku }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <span class="font-bold text-gray-900">${{ (row.basePrice || 0).toFixed(2) }}</span>
              <span class="text-xs text-gray-500">{{ row.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0 }} in stock</span>
              <span v-if="row.status === 'active' || row.isActive" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Active</span>
              <span v-else-if="row.status === 'draft'" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Draft</span>
              <span v-else class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 capitalize">{{ row.status || 'Unknown' }}</span>
            </div>
            <div class="flex gap-2 mt-3">
              <button @click="openEditModal(row)" class="flex-1 inline-flex items-center justify-center gap-1.5 border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold text-xs py-2 rounded-full"><Pencil class="w-3.5 h-3.5" /> Edit</button>
              <button @click="handleDelete(row._id)" class="flex-1 inline-flex items-center justify-center gap-1.5 border border-red-200 bg-red-50 text-red-600 font-bold text-xs py-2 rounded-full"><Trash2 class="w-3.5 h-3.5" /> Delete</button>
            </div>
          </div>
        </div>
        <div v-if="!pending && filteredRows.length === 0" class="p-10 text-center text-gray-500 text-sm font-medium">No products found.</div>
      </div>

      <div class="hidden md:block overflow-x-auto">
        <UTable :columns="columns" :data="filteredRows" :loading="pending" class="min-w-[800px]" :ui="{ th: { base: 'bg-white text-gray-500 font-bold py-4 border-b border-gray-200' }, td: { base: 'py-4 border-b border-gray-100 last:border-0 text-gray-700 font-medium align-middle' } }">
          
          <template #image-cell="{ row: { original: row } }">
            <div class="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
              <img v-if="productImage(row)" :src="productImage(row)" :alt="row.name" class="h-full w-full object-cover" />
              <Package v-else class="w-6 h-6 text-gray-400" />
            </div>
          </template>

          <template #name-cell="{ row: { original: row } }">
            <div>
              <p class="font-bold text-gray-900">{{ row.name }}</p>
              <p class="text-xs text-gray-500">{{ row.sku }}</p>
            </div>
          </template>

          <template #category-cell="{ row: { original: row } }">
            <span class="capitalize">{{ row.category }}</span>
          </template>

          <template #loading>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500">
              <LoaderCircle class="w-8 h-8 animate-spin mb-4 text-emerald-700" />
              <span class="text-sm font-medium">Loading products...</span>
            </div>
          </template>
          
          <template #empty-state>
            <div class="flex flex-col items-center justify-center py-12 text-gray-500 font-medium">
              <Inbox class="w-12 h-12 mb-4 text-gray-300" />
              <span class="text-sm font-medium">No products found.</span>
            </div>
          </template>
          
          <template #stock-cell="{ row: { original: row } }">
            <span class="font-medium text-gray-700">{{ row.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0 }} in stock</span>
          </template>
          
          <template #status-cell="{ row: { original: row } }">
            <span v-if="row.status === 'active' || row.isActive" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Active</span>
            <span v-else-if="row.status === 'draft'" class="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Draft</span>
            <span v-else class="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 capitalize">{{ row.status || 'Unknown' }}</span>
          </template>
          
          <template #price-cell="{ row: { original: row } }">
            <span class="font-bold text-gray-900">${{ (row.basePrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
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
      
      <!-- Footer Pagination (Mock) -->
      <div v-if="!loading && filteredRows.length > 0" class="px-6 py-4 flex justify-between items-center bg-white">
        <span class="text-sm text-gray-500 font-medium">Showing 1-{{ filteredRows.length }} of {{ filteredRows.length }} products</span>
        <div class="flex space-x-2">
          <UButton variant="outline" color="gray" size="sm" class="font-medium">Previous</UButton>
          <UButton color="primary" class="bg-emerald-700 hover:bg-emerald-800 font-medium" size="sm">1</UButton>
          <UButton variant="outline" color="gray" size="sm" class="font-medium">Next</UButton>
        </div>
      </div>
    </div>

    <!-- Add Product Modal -->
    <CustomModal v-model="isAddModalOpen" :title="isEditing ? 'Edit Product' : 'Add New Product'" maxWidth="2xl">
      <form @submit.prevent="handleSaveProduct" class="space-y-5">
        <CustomInput 
          v-model="newProduct.name" 
          label="Product Name" 
          placeholder="e.g. Summer Cotton Dress" 
          required
        >
          <template #leading>
            <Package class="w-5 h-5 text-gray-400" />
          </template>
        </CustomInput>

        <div class="grid grid-cols-2 gap-5">
          <CustomInput
            v-model="newProduct.sku"
            label="SKU"
            placeholder="e.g. DRESS-001 (auto-generated if blank)"
          />
          <CustomInput
            v-model="newProduct.imageUrl"
            label="Main Image URL"
            placeholder="https://..."
          />
        </div>

        <div class="grid grid-cols-3 gap-5">
          <CustomSelect
            v-model="newProduct.gender"
            label="Gender"
            :options="[{ label: 'Unisex', value: 'unisex' }, { label: 'Girl', value: 'girl' }, { label: 'Boy', value: 'boy' }]"
          />
          <CustomSelect
            v-model="newProduct.productType"
            label="Product Type"
            :options="[
              { label: 'Tops', value: 'tops' },
              { label: 'Bottoms', value: 'bottoms' },
              { label: 'Dresses', value: 'dresses' },
              { label: 'Sets', value: 'sets' },
              { label: 'Pajamas', value: 'pajamas' },
              { label: 'Shoes', value: 'shoes' },
              { label: 'Boots', value: 'boots' },
              { label: 'Coats & Jackets', value: 'coats-jackets' },
              { label: 'Accessories', value: 'accessories' },
              { label: 'Swimwear', value: 'swimwear' }
            ]"
          />
          <CustomSelect
            v-model="newProduct.ageGroup"
            label="Age Group"
            :options="[
              { label: 'Any', value: '' },
              { label: 'Girls (12M-12)', value: 'girls-12m-12' },
              { label: 'Boys (12M-12)', value: 'boys-12m-12' },
              { label: 'Baby Girls (0-24M)', value: 'baby-girls-0-24m' },
              { label: 'Baby Boys (0-24M)', value: 'baby-boys-0-24m' },
              { label: 'Toddler', value: 'toddler' }
            ]"
          />
        </div>

        <CustomTextarea 
          v-model="newProduct.description" 
          label="Description" 
          placeholder="Detailed description of the product..." 
          :rows="3" 
          required 
        />
        
        <CustomSelect 
          v-model="newProduct.categoryId" 
          label="Category" 
          :options="categoryOptions" 
        />
        
        <div class="grid grid-cols-2 gap-5">
          <CustomInput 
            v-model.number="newProduct.basePrice" 
            label="Base Price ($)" 
            type="number" 
            step="0.01" 
            placeholder="0" 
            required
          >
            <template #leading>
              <DollarSign class="w-5 h-5 text-gray-400" />
            </template>
          </CustomInput>
          
          <CustomSelect 
            v-model="newProduct.status" 
            label="Status" 
            :options="[{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }, { label: 'Archived', value: 'archived' }]" 
          />
        </div>

        <div class="flex items-end gap-3">
          <div class="flex-1">
            <CustomSelect 
              v-model="newProduct.policyId" 
              label="Product Policy Profile" 
              :options="policyOptions" 
            />
          </div>
          <button type="button" @click="isAddPolicyModalOpen = true" class="h-[42px] px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm transition-colors whitespace-nowrap">
            + New Policy
          </button>
        </div>

        <div class="border-t border-gray-200 pt-4 mt-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-sm font-bold text-gray-800">Product Variants</h3>
            <button type="button" @click="addVariant" class="text-emerald-700 hover:text-emerald-800 text-xs font-bold">+ Add Variant</button>
          </div>
          
          <div v-for="(variant, index) in newProduct.variants" :key="index" class="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200 relative">
            <button type="button" @click="removeVariant(index)" class="absolute top-2 right-2 text-gray-400 hover:text-red-500">
              <X class="w-4 h-4" />
            </button>
            <div class="flex flex-col space-y-3">
              <CustomInput v-model="variant.size" label="Size" placeholder="e.g. S, M, L" />
              <CustomInput v-model="variant.color" label="Color" placeholder="e.g. Red" />
              <CustomInput v-model="variant.sku" label="SKU" placeholder="e.g. SKU-123" />
              <CustomInput v-model.number="variant.stockQuantity" label="Stock" type="number" placeholder="0" />
            </div>
          </div>
          <div v-if="newProduct.variants.length === 0" class="text-center text-sm text-gray-500 py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No variants added yet.
          </div>
        </div>

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
            :disabled="isCreating"
          >
            <span v-if="!isCreating">{{ isEditing ? 'Update Product' : 'Save Product' }}</span>
            <LoaderCircle v-else class="w-5 h-5 animate-spin" />
          </button>
        </div>
      </form>
    </CustomModal>

    <!-- Quick Add Policy Modal -->
    <CustomModal v-model="isAddPolicyModalOpen" title="Quick Create Policy" maxWidth="2xl">
      <form @submit.prevent="handleQuickCreatePolicy" class="space-y-4">
        <CustomInput v-model="newPolicy.name" label="Profile Name" placeholder="e.g. Standard Clothing Policy" required />
        <CustomTextarea v-model="newPolicy.productDetails" label="Product Details" placeholder="Material, care instructions..." :rows="3" />
        <CustomTextarea v-model="newPolicy.shippingAndReturns" label="Shipping & Returns" placeholder="Timeframe, return window..." :rows="3" />
        
        <div class="flex justify-end space-x-3 pt-4">
          <button type="button" @click="isAddPolicyModalOpen = false" class="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">Cancel</button>
          <button type="submit" class="px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-full transition-colors flex items-center justify-center min-w-[120px]" :disabled="isCreatingPolicy">
            <span v-if="!isCreatingPolicy">Save Policy</span>
            <LoaderCircle v-else class="w-5 h-5 animate-spin" />
          </button>
        </div>
      </form>
    </CustomModal>
    
    <!-- Confirm Delete Modal -->
    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Delete Product"
      message="Are you sure you want to delete this product? This action cannot be undone."
      confirm-text="Delete"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Package, Tag, DollarSign, LoaderCircle, Inbox, Search, X, Pencil, Trash2 } from 'lucide-vue-next'
import { useProducts } from '@/composables/modules/products/useProducts'
import { useCategories } from '@/composables/modules/categories/useCategories'
import { usePolicies } from '@/composables/modules/policies/usePolicies'
import { productsApi } from '@/api_factory/modules/products'

const { products: productsData, creating: isCreating, fetchProducts, createProduct: createProductApi } = useProducts()
const { categories, fetchCategories } = useCategories()
const { policies, loading: isCreatingPolicy, fetchPolicies, createPolicy } = usePolicies()

const toast = useToast()
const q = ref('')
const isAddModalOpen = ref(false)
const isEditing = ref(false)
const productToEdit = ref(null)
const isAddPolicyModalOpen = ref(false)
const pending = ref(true)
const showDeleteConfirm = ref(false)
const productToDelete = ref(null)

const emptyProduct = () => ({
  name: '',
  sku: '',
  imageUrl: '',
  description: '',
  categoryId: '',
  policyId: '',
  basePrice: 0,
  status: 'active',
  gender: 'unisex',
  productType: '',
  ageGroup: '',
  variants: []
})

const newProduct = ref(emptyProduct())

const productImage = (product) => {
  return product?.imageUrls?.thumbnail
    || product?.imageUrls?.medium
    || product?.imageUrls?.original
    || product?.images?.[0]?.url
    || ''
}

const newPolicy = ref({
  name: '',
  productDetails: '',
  shippingAndReturns: ''
})

const categoryOptions = computed(() => {
  return categories.value.map(c => ({
    label: c.name,
    value: c._id
  }))
})

const policyOptions = computed(() => {
  return [
    { label: 'Select a policy...', value: '' },
    ...policies.value.map(p => ({
      label: p.name,
      value: p._id
    }))
  ]
})

const addVariant = () => {
  newProduct.value.variants.push({ size: '', color: '', sku: '', stockQuantity: 0 })
}

const removeVariant = (index) => {
  newProduct.value.variants.splice(index, 1)
}

// Fetch products non-blocking
onMounted(async () => {
  pending.value = true
  await Promise.all([fetchProducts({ includeInactive: 'true', limit: 200 }), fetchCategories(), fetchPolicies()])
  pending.value = false
})

const handleQuickCreatePolicy = async () => {
  try {
    const createdPolicy = await createPolicy(newPolicy.value)
    newProduct.value.policyId = createdPolicy._id
    isAddPolicyModalOpen.value = false
    newPolicy.value = { name: '', productDetails: '', shippingAndReturns: '' }
  } catch (error) {
    console.error('Failed to quick create policy', error)
  }
}

const columns = [
  { accessorKey: 'image', header: '' },
  { accessorKey: 'name', header: 'Product Name' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'price', header: 'Price' },
  { accessorKey: 'stock', header: 'Stock' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'actions', header: 'Actions' }
]

const filteredRows = computed(() => {
  if (!productsData.value) return []
  const products = productsData.value || []
  if (!q.value) {
    return products
  }
  return products.filter((product) => {
    return Object.values(product).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})

const items = (row) => [
  [
    { label: 'Edit' },
    { label: 'Duplicate' }
  ],
  [
    { label: 'Delete', class: 'text-red-500' }
  ]
]

const handleSaveProduct = async () => {
  try {
    const { imageUrl, ...rest } = newProduct.value
    const payload: any = {
      ...rest,
      seo: {
        title: rest.name,
        description: rest.description,
        slug: rest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      }
    }
    if (!payload.ageGroup) delete payload.ageGroup
    if (!payload.productType) delete payload.productType
    if (!payload.categoryId) delete payload.categoryId
    if (!payload.policyId) delete payload.policyId
    if (!payload.sku) delete payload.sku
    payload.variants = (payload.variants || []).map((v: any, index: number) => ({
      ...v,
      sku: v.sku || `${(payload.name || 'ITEM').slice(0, 6).toUpperCase()}-${index + 1}`,
      stockQuantity: Number(v.stockQuantity) || 0
    }))
    if (imageUrl) {
      payload.imageUrls = { thumbnail: imageUrl, medium: imageUrl, large: imageUrl, original: imageUrl }
      payload.images = [{ url: imageUrl, altText: rest.name, isFeatured: true, order: 0, uploadedAt: new Date().toISOString() }]
    }
    
    if (isEditing.value && productToEdit.value) {
      await productsApi.updateProduct(productToEdit.value, payload)
      toast.add({ title: 'Success', description: 'Product updated successfully', color: 'emerald' })
    } else {
      await createProductApi(payload)
      toast.add({ title: 'Success', description: 'Product created successfully', color: 'emerald' })
    }
    await fetchProducts()
    isAddModalOpen.value = false
    isEditing.value = false
    productToEdit.value = null
    newProduct.value = emptyProduct()
  } catch (error) {
    console.error('Failed to save product', error)
    toast.add({ title: 'Error', description: error.message || 'Failed to save product', color: 'red' })
  }
}

const openEditModal = (product) => {
  isEditing.value = true
  productToEdit.value = product._id
  newProduct.value = {
    name: product.name,
    sku: product.sku || '',
    imageUrl: productImage(product),
    description: product.description || '',
    categoryId: product.categoryId?._id || product.categoryId || '',
    policyId: product.policyId || '',
    basePrice: product.basePrice || 0,
    status: product.status || 'active',
    gender: product.gender || 'unisex',
    productType: product.productType || '',
    ageGroup: product.ageGroup || '',
    variants: product.variants ? JSON.parse(JSON.stringify(product.variants)) : []
  }
  isAddModalOpen.value = true
}

const handleDelete = (id) => {
  productToDelete.value = id
  showDeleteConfirm.value = true
}

const executeDelete = async () => {
  if (!productToDelete.value) return
  
  try {
    await productsApi.deleteProduct(productToDelete.value)
    showDeleteConfirm.value = false
    productToDelete.value = null
    await fetchProducts()
    toast.add({
      title: 'Success',
      description: 'Product deleted successfully',
      color: 'emerald'
    })
  } catch (error) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to delete product',
      color: 'red'
    })
  }
}
</script>
