<template>
  <div class="max-w-5xl space-y-8">
    <div class="border-b border-gray-200 pb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-1">Storefront Settings</h1>
      <p class="text-gray-500 font-medium">Configure the homepage carousel, featured categories, and brand story.</p>
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
    </div>

    <div v-else class="grid gap-8">
      <!-- Hero Carousel -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 class="font-bold text-lg text-gray-900">Hero Carousel</h2>
          <button @click="addHero" class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-semibold transition-colors">+ Add Slide</button>
        </div>
        <div class="p-6 space-y-8">
          <div v-for="(hero, idx) in settings.heroCarousel" :key="idx" class="border border-gray-100 rounded-lg p-4 relative group">
            <button @click="removeHero(idx)" class="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 z-10">
              <Trash2 class="w-4 h-4" />
            </button>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-1">Image</label>
                <div v-if="hero.imageUrl" class="relative w-full h-32 rounded border border-gray-200 overflow-hidden mb-2 group">
                  <img :src="hero.imageUrl" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="hero.imageUrl = ''" class="text-white text-xs font-semibold bg-red-600 px-3 py-1 rounded">Remove</button>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors relative">
                  <input type="file" @change="e => uploadImage(e, (url) => hero.imageUrl = url)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" :disabled="uploading" />
                  <UploadCloud v-if="!uploading" class="w-6 h-6 text-gray-400 mb-2" />
                  <span v-if="!uploading" class="text-sm text-gray-500 font-medium">Click to upload image</span>
                  <div v-else class="flex items-center space-x-2">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                    <span class="text-sm text-gray-500 font-medium">Uploading...</span>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <CustomInput v-model="hero.title" label="Title (use \n for newline)" placeholder="ICONIC\nFOR\nAUTUMN" />
                <CustomInput v-model="hero.subtitle" label="Subtitle" placeholder="Charming outfits..." />
                <div class="grid grid-cols-2 gap-2">
                  <CustomInput v-model="hero.ctaText" label="Button Text" placeholder="Shop Boys" />
                  <CustomInput v-model="hero.ctaLink" label="Button Link" placeholder="/category/boy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Categories -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 class="font-bold text-lg text-gray-900">Featured Categories</h2>
          <button @click="addCategory" class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md font-semibold transition-colors">+ Add Category</button>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(cat, idx) in settings.featuredCategories" :key="idx" class="border border-gray-100 rounded-lg p-4 relative group bg-gray-50/50">
              <button @click="removeCategory(idx)" class="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 z-10">
                <Trash2 class="w-4 h-4" />
              </button>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-1">Image</label>
                  <div v-if="cat.imageUrl" class="relative w-full aspect-[3/4] rounded border border-gray-200 overflow-hidden mb-2 group/img">
                    <img :src="cat.imageUrl" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <button @click="cat.imageUrl = ''" class="text-white text-xs font-semibold bg-red-600 px-3 py-1 rounded">Remove</button>
                    </div>
                  </div>
                  <div v-else class="flex flex-col items-center justify-center w-full aspect-[3/4] border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors relative">
                    <input type="file" @change="e => uploadImage(e, (url) => cat.imageUrl = url)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" :disabled="uploading" />
                    <UploadCloud v-if="!uploading" class="w-6 h-6 text-gray-400 mb-2" />
                    <span v-if="!uploading" class="text-sm text-gray-500 font-medium">Click to upload</span>
                    <div v-else class="flex items-center space-x-2">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                      <span class="text-sm text-gray-500 font-medium">Uploading...</span>
                    </div>
                  </div>
                </div>
                <CustomInput v-model="cat.title" label="Category Title" placeholder="Shop Boy" />
                <CustomInput v-model="cat.link" label="Link" placeholder="/category/boy" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Brand Story -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 class="font-bold text-lg text-gray-900">Brand Story (SEO Text)</h2>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-3 gap-6">
            <div class="space-y-4">
              <CustomInput v-model="settings.brandStory.section1Title" label="Section 1 Title" />
              <label class="block text-sm font-bold text-gray-700 mb-1">Section 1 Text</label>
              <textarea v-model="settings.brandStory.section1Text" rows="4" class="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"></textarea>
            </div>
            <div class="space-y-4">
              <CustomInput v-model="settings.brandStory.section2Title" label="Section 2 Title" />
              <label class="block text-sm font-bold text-gray-700 mb-1">Section 2 Text</label>
              <textarea v-model="settings.brandStory.section2Text" rows="4" class="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"></textarea>
            </div>
            <div class="space-y-4">
              <CustomInput v-model="settings.brandStory.section3Title" label="Section 3 Title" />
              <label class="block text-sm font-bold text-gray-700 mb-1">Section 3 Text</label>
              <textarea v-model="settings.brandStory.section3Text" rows="4" class="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end pt-4 pb-12">
        <button @click="saveSettings" :disabled="saving" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center shadow-md disabled:opacity-50">
          <Save class="w-5 h-5 mr-2" /> {{ saving ? 'Saving...' : 'Save Storefront Settings' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Save, Trash2, UploadCloud } from 'lucide-vue-next'
import { GATEWAY_ENDPOINT } from '~/api_factory/axios.config'

const toast = useToast()

const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)

const settings = ref({
  heroCarousel: [],
  featuredCategories: [],
  brandStory: {
    section1Title: '', section1Text: '',
    section2Title: '', section2Text: '',
    section3Title: '', section3Text: ''
  }
})

const fetchSettings = async () => {
  try {
    loading.value = true
    const res = await GATEWAY_ENDPOINT.get('/settings/storefront')
    if (res.data) {
      settings.value = res.data
    }
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to fetch settings', color: 'red' })
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  try {
    saving.value = true
    await GATEWAY_ENDPOINT.put('/settings/storefront', settings.value)
    toast.add({ title: 'Success', description: 'Storefront settings updated successfully!', color: 'green' })
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to update settings', color: 'red' })
  } finally {
    saving.value = false
  }
}

const addHero = () => {
  settings.value.heroCarousel.push({
    imageUrl: '', title: '', subtitle: '', ctaText: '', ctaLink: ''
  })
}

const removeHero = (idx) => {
  settings.value.heroCarousel.splice(idx, 1)
}

const addCategory = () => {
  settings.value.featuredCategories.push({
    title: '', imageUrl: '', link: ''
  })
}

const removeCategory = (idx) => {
  settings.value.featuredCategories.splice(idx, 1)
}

const uploadImage = async (event, callback) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    uploading.value = true
    const formData = new FormData()
    formData.append('file', file)

    const res = await GATEWAY_ENDPOINT.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (res.data?.url) {
      callback(res.data.url)
      toast.add({ title: 'Success', description: 'Image uploaded successfully!', color: 'green' })
    }
  } catch (error) {
    console.error('Upload failed:', error)
    toast.add({ title: 'Error', description: 'Failed to upload image.', color: 'red' })
  } finally {
    uploading.value = false
    event.target.value = '' // reset file input
  }
}

onMounted(() => {
  fetchSettings()
})
</script>
