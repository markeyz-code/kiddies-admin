<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-stone-900">Coupons</h1>
        <p class="mt-2 text-sm text-stone-700">Manage discount coupons for your store.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button @click="showAddModal = true" class="inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:w-auto">
          Add Coupon
        </button>
      </div>
    </div>

    <!-- Coupons List -->
    <div class="mt-8 flex flex-col">
      <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table class="min-w-full divide-y divide-stone-300">
              <thead class="bg-stone-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-stone-900 sm:pl-6">Code</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-stone-900">Discount</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-stone-900">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-stone-200 bg-white">
                <tr v-if="loading" class="text-center py-4 text-sm text-stone-500">
                  <td colspan="4" class="py-4">Loading coupons...</td>
                </tr>
                <tr v-else-if="coupons.length === 0" class="text-center py-4 text-sm text-stone-500">
                  <td colspan="4" class="py-4">No coupons found.</td>
                </tr>
                <tr v-for="coupon in coupons" :key="coupon._id">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-stone-900 sm:pl-6">
                    {{ coupon.code }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-stone-500">
                    <span v-if="coupon.discountType === 'percentage'">{{ coupon.discountValue }}%</span>
                    <span v-else>₦{{ coupon.discountValue.toFixed(2) }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-stone-500">
                    <span :class="[coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800', 'inline-flex rounded-full px-2 text-xs font-semibold leading-5']">
                      {{ coupon.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button @click="handleDelete(coupon._id)" class="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Coupon Modal -->
    <div v-if="showAddModal" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-stone-500 bg-opacity-75 transition-opacity"></div>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <form @submit.prevent="handleSubmit">
              <div>
                <h3 class="text-lg font-medium leading-6 text-stone-900" id="modal-title">Add New Coupon</h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-stone-700">Coupon Code</label>
                    <input v-model="form.code" type="text" required class="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 px-3 border uppercase" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-stone-700">Discount Type</label>
                    <select v-model="form.discountType" class="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 px-3 border">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₦)</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-stone-700">Discount Value</label>
                    <input v-model="form.discountValue" type="number" required min="1" class="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm py-2 px-3 border" />
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button type="submit" :disabled="loading" class="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm disabled:opacity-50">
                  {{ loading ? 'Saving...' : 'Save Coupon' }}
                </button>
                <button type="button" @click="showAddModal = false" class="mt-3 inline-flex w-full justify-center rounded-md border border-stone-300 bg-white px-4 py-2 text-base font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCoupons } from '@/composables/modules/coupons/useCoupons';

definePageMeta({
  layout: 'dashboard'
});

const { loading, coupons, fetchCoupons, createCoupon, deleteCoupon } = useCoupons();

const showAddModal = ref(false);
const form = ref({
  code: '',
  discountType: 'percentage',
  discountValue: 0
});

onMounted(() => {
  fetchCoupons();
});

const handleSubmit = async () => {
  try {
    await createCoupon(form.value);
    showAddModal.value = false;
    form.value = { code: '', discountType: 'percentage', discountValue: 0 };
  } catch (error) {
    // Error handled in composable
  }
};

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this coupon?')) {
    await deleteCoupon(id);
  }
};
</script>
