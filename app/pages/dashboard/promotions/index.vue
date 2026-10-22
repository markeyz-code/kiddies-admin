<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-8">
      <div>
        <h1 class="text-2xl font-bold">Promotions & Banners</h1>
        <p class="text-gray-500 font-medium">Manage hero banners, category promos and mega-menu ads.</p>
      </div>
      <button @click="openCreate" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-5 rounded-full transition-colors text-sm">
        + New Promotion
      </button>
    </div>

    <div class="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <h2 class="text-lg font-bold text-gray-800">
        Promotions — <span class="font-normal">{{ filteredPromotions.length }} records</span>
      </h2>
      <div class="flex gap-3">
        <input v-model="search" type="search" placeholder="Search promotions..." class="border border-gray-300 rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:border-emerald-600 w-64" />
        <select v-model="typeFilter" class="border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold bg-white focus:outline-none focus:border-emerald-600">
          <option value="">All types</option>
          <option value="hero">Hero</option>
          <option value="banner">Banner</option>
          <option value="megamenu_ad">Mega menu ad</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <LoaderCircle class="w-8 h-8 animate-spin text-emerald-700" />
    </div>

    <div v-else-if="filteredPromotions.length === 0" class="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
      <Megaphone class="w-12 h-12 mx-auto text-gray-300 mb-3" />
      <p class="text-gray-500 font-medium">No promotions yet. Create your first banner.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <div v-for="promo in filteredPromotions" :key="promo._id" class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
        <div class="h-40 bg-gray-100 overflow-hidden">
          <img v-if="promo.imageUrl" :src="promo.imageUrl" :alt="promo.title" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon class="w-8 h-8" />
          </div>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">{{ promo.type }}</span>
            <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" :class="promo.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'">
              {{ promo.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <h3 class="font-bold text-gray-900">{{ promo.title }}</h3>
          <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ promo.subtitle || 'No subtitle' }}</p>
          <p v-if="promo.ctaText" class="text-xs text-gray-400 mt-2">CTA: {{ promo.ctaText }} → {{ promo.ctaLink || '/' }}</p>
          <div class="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
            <button @click="toggleActive(promo)" class="text-xs font-bold px-3 py-1.5 rounded-full" :class="promo.isActive ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'">
              {{ promo.isActive ? 'Deactivate' : 'Activate' }}
            </button>
            <button @click="openEdit(promo)" class="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">Edit</button>
            <button @click="askDelete(promo)" class="text-xs font-bold px-3 py-1.5 rounded-full bg-red-50 text-red-600 ml-auto">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <CustomModal v-model="isModalOpen" :title="editingId ? 'Edit Promotion' : 'Create Promotion'" maxWidth="2xl">
      <form @submit.prevent="save" class="space-y-5">
        <CustomInput v-model="form.title" label="Title" placeholder="e.g. Autumn New Arrivals" required />
        <CustomInput v-model="form.subtitle" label="Subtitle" placeholder="Short supporting text" />

        <div class="grid grid-cols-2 gap-5">
          <CustomSelect
            v-model="form.type"
            label="Placement"
            :options="[
              { label: 'Hero Banner', value: 'hero' },
              { label: 'Standard Banner', value: 'banner' },
              { label: 'Mega Menu Ad', value: 'megamenu_ad' }
            ]"
          />
          <CustomSelect
            v-if="form.type === 'megamenu_ad'"
            v-model="form.categoryTarget"
            label="Menu Target"
            :options="[
              { label: 'Boy', value: 'boy' },
              { label: 'Girl', value: 'girl' },
              { label: 'Toddler Boy', value: 'toddler-boy' },
              { label: 'Toddler Girl', value: 'toddler-girl' },
              { label: 'Baby', value: 'baby' }
            ]"
          />
          <CustomInput v-else v-model="form.backgroundColor" label="Background Color" placeholder="#111827" />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">Image</label>
          <div class="flex gap-3">
            <CustomInput v-model="form.imageUrl" placeholder="https://images.example.com/banner.jpg" class="flex-1" />
            <label class="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2.5 rounded-lg text-sm whitespace-nowrap flex items-center">
              <UploadCloud class="w-4 h-4 mr-2" /> Upload
              <input type="file" accept="image/*" class="hidden" @change="uploadImage" :disabled="uploading" />
            </label>
          </div>
          <div v-if="form.imageUrl" class="mt-3 h-32 rounded-lg overflow-hidden border border-gray-200">
            <img :src="form.imageUrl" class="w-full h-full object-cover" />
          </div>
          <p v-if="uploading" class="text-xs text-emerald-700 font-bold mt-2">Uploading image…</p>
        </div>

        <div class="grid grid-cols-2 gap-5">
          <CustomInput v-model="form.ctaText" label="Button Text" placeholder="Shop Now" />
          <CustomInput v-model="form.ctaLink" label="Button Link" placeholder="/products?category=sale" />
        </div>

        <label class="flex items-center gap-2 text-sm font-bold text-gray-700">
          <input type="checkbox" v-model="form.isActive" class="w-4 h-4 rounded text-emerald-600" />
          Active (visible on storefront)
        </label>

        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="isModalOpen = false" class="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full">Cancel</button>
          <button type="submit" :disabled="saving" class="px-5 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-full disabled:opacity-50">
            {{ saving ? 'Saving…' : editingId ? 'Update Promotion' : 'Create Promotion' }}
          </button>
        </div>
      </form>
    </CustomModal>

    <ConfirmModal
      v-model="showDeleteConfirm"
      title="Delete Promotion"
      message="Delete this promotion? It will immediately disappear from the storefront."
      confirm-text="Delete"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { LoaderCircle, Megaphone, Image as ImageIcon, UploadCloud } from 'lucide-vue-next'
import { promotionsApi } from '@/api_factory/modules/promotions'
import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'

const toast = useToast()
const promotions = ref([])
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)
const isModalOpen = ref(false)
const editingId = ref(null)
const search = ref('')
const typeFilter = ref('')
const showDeleteConfirm = ref(false)
const pendingDelete = ref(null)

const emptyForm = () => ({
  title: '',
  subtitle: '',
  type: 'hero',
  imageUrl: '',
  backgroundColor: '',
  ctaText: '',
  ctaLink: '',
  categoryTarget: '',
  isActive: true
})

const form = ref(emptyForm())

const fetchPromotions = async () => {
  loading.value = true
  try {
    const { data } = await promotionsApi.getPromotions()
    promotions.value = data
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to load promotions', color: 'red' })
  } finally {
    loading.value = false
  }
}

const filteredPromotions = computed(() => {
  const term = search.value.trim().toLowerCase()
  return promotions.value.filter((p) => {
    const matchesType = !typeFilter.value || p.type === typeFilter.value
    const matchesSearch = !term || [p.title, p.subtitle, p.categoryTarget].join(' ').toLowerCase().includes(term)
    return matchesType && matchesSearch
  })
})

const openCreate = () => {
  editingId.value = null
  form.value = emptyForm()
  isModalOpen.value = true
}

const openEdit = (promo) => {
  editingId.value = promo._id
  form.value = {
    ...emptyForm(),
    ...promo
  }
  isModalOpen.value = true
}

const save = async () => {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (payload.type === 'megamenu_ad' && !payload.categoryTarget) {
      payload.categoryTarget = 'girl'
    }
    if (editingId.value) {
      await promotionsApi.updatePromotion(editingId.value, payload)
    } else {
      await promotionsApi.createPromotion(payload)
    }
    toast.add({ title: 'Success', description: 'Promotion saved', color: 'emerald' })
    isModalOpen.value = false
    await fetchPromotions()
  } catch (error) {
    toast.add({ title: 'Error', description: error?.response?.data?.message || 'Failed to save promotion', color: 'red' })
  } finally {
    saving.value = false
  }
}

const toggleActive = async (promo) => {
  try {
    await promotionsApi.updatePromotion(promo._id, { isActive: !promo.isActive })
    promo.isActive = !promo.isActive
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to update promotion', color: 'red' })
  }
}

const askDelete = (promo) => {
  pendingDelete.value = promo
  showDeleteConfirm.value = true
}

const executeDelete = async () => {
  if (!pendingDelete.value) return
  try {
    await promotionsApi.deletePromotion(pendingDelete.value._id)
    promotions.value = promotions.value.filter((p) => p._id !== pendingDelete.value._id)
    toast.add({ title: 'Success', description: 'Promotion deleted', color: 'emerald' })
  } finally {
    showDeleteConfirm.value = false
    pendingDelete.value = null
  }
}

const uploadImage = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await GATEWAY_ENDPOINT_WITH_AUTH.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    form.value.imageUrl = data.url
  } catch (error) {
    toast.add({ title: 'Error', description: 'Image upload failed', color: 'red' })
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

onMounted(fetchPromotions)
</script>
