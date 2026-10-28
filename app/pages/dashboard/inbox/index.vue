<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-8">
      <div>
        <h1 class="text-2xl font-bold">Inbox</h1>
        <p class="text-gray-500 font-medium">Customer messages and newsletter subscribers.</p>
      </div>
      <button @click="loadAll" :disabled="loading" class="bg-brand-700 hover:bg-brand-800 text-white font-bold py-2.5 px-5 rounded-full text-sm disabled:opacity-50">
        {{ loading ? 'Refreshing…' : 'Refresh' }}
      </button>
    </div>

    <div class="flex gap-2 mb-6">
      <button @click="tab = 'messages'" class="px-5 py-2 rounded-full text-sm font-bold" :class="tab === 'messages' ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-700'">
        Messages ({{ messages.length }})
      </button>
      <button @click="tab = 'subscribers'" class="px-5 py-2 rounded-full text-sm font-bold" :class="tab === 'subscribers' ? 'bg-brand-700 text-white' : 'bg-gray-100 text-gray-700'">
        Subscribers ({{ subscribers.length }})
      </button>
    </div>

    <input v-model="search" type="search" placeholder="Search…" class="mb-4 border border-gray-300 rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:border-brand-600 w-72" />

    <div v-if="loading" class="flex justify-center p-12">
      <LoaderCircle class="w-8 h-8 animate-spin text-brand-700" />
    </div>

    <div v-else-if="tab === 'messages'" class="space-y-4">
      <div v-if="filteredMessages.length === 0" class="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500 font-medium">No messages yet.</div>
      <div v-for="message in filteredMessages" :key="message._id" class="bg-white border border-gray-200 rounded-xl p-5">
        <div class="flex flex-wrap justify-between gap-2 mb-2">
          <div>
            <p class="font-bold text-gray-900">{{ message.firstName }} {{ message.lastName }}</p>
            <a :href="`mailto:${message.email}`" class="text-sm text-brand-700 font-medium">{{ message.email }}</a>
          </div>
          <span class="text-xs text-gray-500 font-medium">{{ new Date(message.createdAt).toLocaleString() }}</span>
        </div>
        <p class="text-sm text-gray-700 whitespace-pre-line">{{ message.message }}</p>
        <a :href="`mailto:${message.email}?subject=Re: Your JasmarKids enquiry`" class="inline-block mt-3 text-xs font-bold text-brand-700 border border-brand-200 bg-brand-50 px-3 py-1.5 rounded-full">Reply by email</a>
      </div>
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div v-if="filteredSubscribers.length === 0" class="p-12 text-center text-gray-500 font-medium">No subscribers yet.</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 font-bold text-left">
          <tr><th class="px-5 py-3">Email</th><th class="px-5 py-3">Subscribed</th><th class="px-5 py-3">Status</th></tr>
        </thead>
        <tbody>
          <tr v-for="subscriber in filteredSubscribers" :key="subscriber._id" class="border-t border-gray-100">
            <td class="px-5 py-3 font-medium text-gray-900">{{ subscriber.email }}</td>
            <td class="px-5 py-3 text-gray-500">{{ new Date(subscriber.createdAt).toLocaleDateString() }}</td>
            <td class="px-5 py-3">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold" :class="subscriber.isActive ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'">
                {{ subscriber.isActive ? 'Active' : 'Unsubscribed' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { LoaderCircle } from 'lucide-vue-next'
import { inboxApi } from '@/api_factory/modules/inbox'

const toast = useToast()
const tab = ref('messages')
const search = ref('')
const loading = ref(true)
const messages = ref([])
const subscribers = ref([])

const loadAll = async () => {
  loading.value = true
  try {
    const [messageRes, subscriberRes] = await Promise.all([
      inboxApi.getMessages(),
      inboxApi.getSubscribers()
    ])
    messages.value = messageRes.data || []
    subscribers.value = subscriberRes.data || []
  } catch (error) {
    toast.add({ title: 'Error', description: 'Failed to load inbox', color: 'red' })
  } finally {
    loading.value = false
  }
}

const term = computed(() => search.value.trim().toLowerCase())
const filteredMessages = computed(() => messages.value.filter((m) =>
  !term.value || [m.firstName, m.lastName, m.email, m.message].join(' ').toLowerCase().includes(term.value)
))
const filteredSubscribers = computed(() => subscribers.value.filter((s) =>
  !term.value || String(s.email).toLowerCase().includes(term.value)
))

onMounted(loadAll)
</script>
