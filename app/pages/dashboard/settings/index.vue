<template>
  <div class="max-w-4xl space-y-8">
    <div class="border-b border-gray-200 pb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
      <p class="text-gray-500 font-medium">Manage your store configuration.</p>
    </div>

    <div class="grid gap-8">
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
            <CustomInput v-model="settings.currency" label="Store Currency" placeholder="USD">
              <template #leading>
                <Globe class="w-5 h-5 text-gray-400" />
              </template>
            </CustomInput>
          </div>

          <div class="flex justify-end pt-4 border-t border-gray-100">
            <button class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-full transition-colors text-sm flex items-center">
              <Save class="w-4 h-4 mr-2" /> Save Changes
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
          <div class="flex justify-end pt-4 border-t border-gray-100">
            <button class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-full transition-colors text-sm flex items-center">
              <Save class="w-4 h-4 mr-2" /> Save Changes
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
            <button class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-6 rounded-full transition-colors text-sm flex items-center">
              <Save class="w-4 h-4 mr-2" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Store, Mail, Globe, Truck, Percent, Save } from 'lucide-vue-next'

const settings = ref({
  storeName: 'JasmarKids',
  storeEmail: 'hello@jasmarkids.com',
  currency: 'USD',
  shippingFee: 5.99,
  freeShippingThreshold: 50.00,
  taxRate: 7.5,
})
</script>
