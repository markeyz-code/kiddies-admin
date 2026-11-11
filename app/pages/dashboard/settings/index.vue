<template>
  <div class="max-w-4xl space-y-8">
    <div class="border-b border-gray-200 pb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
      <p class="text-gray-500 font-medium">Manage your store configuration.</p>
    </div>

    <div v-if="loading" class="flex justify-center p-12">
      <LoaderCircle class="w-8 h-8 animate-spin text-brand-700" />
    </div>

    <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <p class="text-sm font-bold text-red-700 mb-3">{{ loadError }}</p>
      <button @click="fetchSettings" class="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-full text-sm">Retry</button>
    </div>

    <div v-else class="grid gap-8">
      <!-- Store Information -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 class="font-bold text-lg text-gray-900">Store Information</h2>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <CustomInput v-model="settings.storeName" label="Store Name" placeholder="JasmarKids">
              <template #leading>
                <Store class="w-5 h-5 text-gray-400" />
              </template>
            </CustomInput>
            
            <CustomInput v-model="settings.storeEmail" type="email" label="Store Email" placeholder="hello@jasmarkids.com">
              <template #leading>
                <Mail class="w-5 h-5 text-gray-400" />
              </template>
            </CustomInput>
          </div>

          <div class="w-full md:w-1/2">
            <CustomInput v-model="settings.currency" label="Store Currency" placeholder="NGN">
              <template #leading>
                <Globe class="w-5 h-5 text-gray-400" />
              </template>
            </CustomInput>
          </div>

          <div class="flex justify-end pt-4 border-t border-gray-100">
            <button @click="saveSettings" :disabled="saving || loading || !!loadError" class="bg-brand-700 hover:bg-brand-800 text-white font-bold py-2.5 px-6 rounded-full transition-colors text-sm flex items-center disabled:opacity-50">
              <Save class="w-4 h-4 mr-2" /> {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Contact & Social -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 class="font-bold text-lg text-gray-900">Contact &amp; Announcement Bar</h2>
        </div>
        <div class="p-6 space-y-6">
          <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <label class="flex cursor-pointer items-start gap-3">
              <input v-model="settings.announcementEnabled" type="checkbox" class="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-700 focus:ring-brand-500" />
              <span>
                <span class="block text-sm font-bold text-gray-900">Show the announcement bar on the storefront</span>
                <span class="mt-0.5 block text-xs text-gray-500">When this is off, or the message is empty, nothing is shown at the top of the website.</span>
              </span>
            </label>
          </div>
          <div class="grid md:grid-cols-2 gap-6">
            <CustomInput v-model="settings.phone" label="Phone / WhatsApp Number" placeholder="0807 913 1425" />
            <CustomInput v-model="settings.announcement" label="Announcement Message" placeholder="Leave empty to hide the bar" />
          </div>
          <div class="grid md:grid-cols-2 gap-6">
            <CustomInput v-model="settings.announcementLink" label="Announcement Link (optional)" placeholder="/products" />
            <CustomInput v-model="settings.announcementLinkText" label="Announcement Button Text" placeholder="Shop now" />
          </div>
          <CustomInput v-model="settings.address" label="Boutique / Delivery Note" placeholder="Online Boutique — Nationwide Delivery Across Nigeria" />
          <div class="grid md:grid-cols-3 gap-6">
            <CustomInput v-model="settings.instagram" label="Instagram URL" placeholder="https://instagram.com/..." />
            <CustomInput v-model="settings.facebook" label="Facebook URL" placeholder="https://facebook.com/..." />
            <CustomInput v-model="settings.twitter" label="X / Twitter URL" placeholder="https://x.com/..." />
          </div>
          <div class="flex justify-end pt-4 border-t border-gray-100">
            <button @click="saveSettings" :disabled="saving || loading || !!loadError" class="bg-brand-700 hover:bg-brand-800 text-white font-bold py-2.5 px-6 rounded-full transition-colors text-sm flex items-center disabled:opacity-50">
              <Save class="w-4 h-4 mr-2" /> {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Shipping Settings -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 class="font-bold text-lg text-gray-900">Shipping Configuration</h2>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <CustomInput v-model.number="settings.shippingFee" type="number" step="0.01" label="Default Shipping Fee (₦)">
              <template #leading>
                <Truck class="w-5 h-5 text-gray-400" />
              </template>
            </CustomInput>
            
            <CustomInput v-model.number="settings.freeShippingThreshold" type="number" step="0.01" label="Free Shipping Threshold (₦)">
              <template #leading>
                <Truck class="w-5 h-5 text-gray-400" />
              </template>
            </CustomInput>
          </div>
          <div class="rounded-xl bg-brand-50 border border-brand-200 p-4 text-sm text-brand-800">
            <p class="font-bold mb-1">How to avoid losing money on delivery</p>
            <p>Set the delivery fee to your real average courier cost, including packaging. A free-shipping threshold of at least <strong>10× the delivery fee</strong> (for example ₦90,000 when delivery is ₦9,000) keeps delivery below about 10% of the order value. Only lower it if your product margin can absorb the difference.</p>
          </div>

          <div class="flex justify-end pt-4 border-t border-gray-100">
            <button @click="saveSettings" :disabled="saving || loading || !!loadError" class="bg-brand-700 hover:bg-brand-800 text-white font-bold py-2.5 px-6 rounded-full transition-colors text-sm flex items-center disabled:opacity-50">
              <Save class="w-4 h-4 mr-2" /> {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tax Settings -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 class="font-bold text-lg text-gray-900">Tax Settings</h2>
        </div>
        <div class="p-6 space-y-6">
          <div class="w-full md:w-1/2">
            <CustomInput v-model.number="settings.taxRate" type="number" step="0.01" label="Tax Rate (%)">
              <template #leading>
                <Percent class="w-5 h-5 text-gray-400" />
              </template>
            </CustomInput>
          </div>
          
          <div class="flex justify-end pt-4 border-t border-gray-100">
            <button @click="saveSettings" :disabled="saving || loading || !!loadError" class="bg-brand-700 hover:bg-brand-800 text-white font-bold py-2.5 px-6 rounded-full transition-colors text-sm flex items-center disabled:opacity-50">
              <Save class="w-4 h-4 mr-2" /> {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Store, Mail, Globe, Truck, Percent, Save, LoaderCircle } from 'lucide-vue-next'
import { settingsApi } from '@/api_factory/modules/settings'

const toast = useToast()
const loading = ref(true)
const saving = ref(false)

const settings = ref({
  storeName: '',
  storeEmail: '',
  phone: '',
  address: '',
  currency: 'NGN',
  shippingFee: 0,
  freeShippingThreshold: 0,
  taxRate: 0,
  instagram: '',
  facebook: '',
  twitter: '',
  announcementEnabled: false,
  announcement: '',
  announcementLink: '',
  announcementLinkText: 'Shop now'
})

const loadError = ref('')

const fetchSettings = async () => {
  loading.value = true
  loadError.value = ''
  try {
    const { data } = await settingsApi.getGeneral()
    if (!data?.storeName) {
      throw new Error('Store settings were empty or unavailable')
    }
    settings.value = { ...settings.value, ...data }
  } catch (error) {
    loadError.value = error?.response?.data?.message || error?.message || 'Failed to load settings'
    toast.add({ title: 'Error', description: loadError.value, color: 'red' })
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    const { data } = await settingsApi.updateGeneral(settings.value)
    settings.value = { ...settings.value, ...data }
    toast.add({ title: 'Success', description: 'Store settings saved successfully', color: 'emerald' })
  } catch (error) {
    toast.add({ title: 'Error', description: error?.response?.data?.message || 'Failed to save settings', color: 'red' })
  } finally {
    saving.value = false
  }
}

onMounted(fetchSettings)
</script>
