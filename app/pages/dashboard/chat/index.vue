<template>
  <div class="h-screen w-full flex bg-[#f0f2f5] font-sans">
    <!-- Sidebar -->
    <div class="w-full md:w-[30%] lg:w-[350px] flex flex-col bg-white border-r border-gray-200 shrink-0 h-full">
      <!-- Sidebar Header -->
      <div class="h-16 bg-[#f0f2f5] flex items-center justify-between px-4 border-b border-gray-200 shrink-0">
        <div class="flex items-center space-x-3">
          <NuxtLink to="/dashboard" class="text-gray-500 hover:text-gray-700">
            <ArrowLeft class="w-5 h-5" />
          </NuxtLink>
          <div class="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center font-bold text-gray-600">
            A
          </div>
        </div>
        <div class="flex space-x-4 text-gray-500">
          <MessageSquare class="w-5 h-5" />
          <MoreVertical class="w-5 h-5" />
        </div>
      </div>

      <!-- Search -->
      <div class="p-2 border-b border-gray-200 bg-white">
        <div class="bg-[#f0f2f5] rounded-lg flex items-center px-3 py-1.5">
          <Search class="w-4 h-4 text-gray-500 mr-3 shrink-0" />
          <input type="text" placeholder="Search or start new chat" class="bg-transparent border-none focus:outline-none text-sm w-full placeholder-gray-500" />
        </div>
      </div>

      <!-- Chat List -->
      <div class="flex-1 overflow-y-auto bg-white">
        <div v-if="loading" class="flex justify-center p-8 text-emerald-500">
          <LoaderCircle class="w-6 h-6 animate-spin" />
        </div>
        <div v-else-if="sessions.length === 0" class="p-8 text-center text-gray-400 text-sm">
          No active conversations
        </div>
        <div 
          v-else
          v-for="session in sessions" 
          :key="session._id"
          @click="selectSession(session._id)"
          :class="['flex items-center px-3 py-3 cursor-pointer hover:bg-[#f5f6f6]', selectedSession === session._id ? 'bg-[#f0f2f5]' : '']"
        >
          <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mr-3 shrink-0">
            {{ (session.customerName || 'A')[0].toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0 border-b border-gray-100 pb-3 -mb-3 pt-1">
            <div class="flex justify-between items-baseline mb-0.5">
              <h3 class="font-normal text-gray-900 truncate">{{ session.customerName || 'Anonymous' }}</h3>
              <span class="text-xs text-gray-500 shrink-0">{{ new Date(session.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
            </div>
            <p class="text-sm text-gray-500 truncate">{{ session.lastMessage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Chat Area -->
    <div class="flex-1 hidden md:flex flex-col relative bg-[#efeae2] h-full">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-20 pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23000000\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E'); z-index: 0;"></div>

      <template v-if="selectedSession">
        <!-- Chat Header -->
        <div class="h-16 bg-[#f0f2f5] flex items-center px-4 border-b border-gray-200 shrink-0 z-10">
          <div class="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold mr-3">
            {{ (activeSessionDetails?.customerName || 'C')[0].toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-normal text-gray-900 truncate leading-tight">{{ activeSessionDetails?.customerName || 'Customer' }}</h3>
            <p class="text-xs text-gray-500">online</p>
          </div>
          <div class="flex space-x-5 text-gray-500">
            <Search class="w-5 h-5 cursor-pointer" />
            <MoreVertical class="w-5 h-5 cursor-pointer" />
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 z-10" id="admin-chat-messages">
          <div 
            v-for="(msg, index) in activeMessages" 
            :key="index"
            :class="['max-w-[85%] md:max-w-[65%] flex flex-col', msg.sender === 'admin' ? 'self-end ml-auto' : 'self-start']"
          >
            <div :class="['px-3 py-1.5 rounded-lg shadow-sm relative text-sm inline-block', msg.sender === 'admin' ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' : 'bg-white text-gray-900 rounded-tl-none']">
              <template v-if="msg.type === 'image'">
                <img :src="msg.message" class="max-w-xs md:max-w-sm rounded-lg" alt="Uploaded image" />
              </template>
              <template v-else>
                <span class="break-words">{{ msg.message }}</span>
              </template>
              <span class="text-[10px] text-gray-400 float-right mt-2 ml-3">12:00</span>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="h-16 bg-[#f0f2f5] flex items-center px-4 shrink-0 z-10 gap-4 relative">
          <div v-if="showEmojiPicker" class="absolute bottom-full left-4 mb-2 z-50 shadow-xl rounded-lg">
            <ClientOnly>
              <EmojiPicker @select="onSelectEmoji" :native="true" />
            </ClientOnly>
          </div>
          <div class="text-gray-500 flex space-x-4">
            <button type="button" @click.stop="showEmojiPicker = !showEmojiPicker" class="hover:text-gray-700">
              <Smile class="w-6 h-6 cursor-pointer" />
            </button>
            <button type="button" @click="fileInput.click()" class="hover:text-gray-700">
              <Paperclip class="w-6 h-6 cursor-pointer" />
            </button>
            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="hidden" />
          </div>
          <form @submit.prevent="sendMessage" class="flex-1 flex items-center">
            <input 
              v-model="newMessage" 
              placeholder="Type a message" 
              class="w-full bg-white rounded-lg py-2.5 px-4 focus:outline-none text-sm placeholder-gray-500 border-none"
            />
          </form>
          <div class="text-gray-500">
            <button v-if="newMessage.trim()" @click="sendMessage" class="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
              <Send class="w-6 h-6" />
            </button>
            <Mic v-else class="w-6 h-6 cursor-pointer" />
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-500 z-10 bg-[#f0f2f5] border-l border-gray-200">
        <div class="max-w-md text-center">
          <h2 class="text-3xl font-light text-gray-700 mb-4">JasmarKids Web</h2>
          <p class="text-sm text-gray-500 mb-8">Send and receive messages without keeping your phone online.<br/>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
          <div class="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <Lock class="w-3 h-3" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { io } from 'socket.io-client'
import { ArrowLeft, MessageSquare, MoreVertical, Search, LoaderCircle, Smile, Paperclip, Mic, Send, Lock } from 'lucide-vue-next'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

definePageMeta({ layout: 'chat' })

const loading = ref(true)
const sessions = ref([])
const selectedSession = ref(null)
const activeMessages = ref([])
const newMessage = ref('')
const showEmojiPicker = ref(false)
const fileInput = ref(null)

let socket = null

const activeSessionDetails = computed(() => {
  if (!selectedSession.value) return null
  return sessions.value.find(s => s._id === selectedSession.value)
})

const fetchSessions = async () => {
  try {
    const res = await fetch('http://localhost:3002/chat/sessions')
    sessions.value = await res.json()
  } catch (err) {
    console.error('Error fetching sessions:', err)
  } finally {
    loading.value = false
  }
}

const selectSession = async (sessionId) => {
  selectedSession.value = sessionId
  
  // Join the specific room for this session
  if (socket) {
    socket.emit('join_room', sessionId)
  }

  try {
    const res = await fetch(`http://localhost:3002/chat/session/${sessionId}`)
    activeMessages.value = await res.json()
    scrollToBottom()
  } catch (err) {
    console.error('Error fetching session messages:', err)
  }
}

const onSelectEmoji = (emoji) => {
  newMessage.value += emoji.i
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file && selectedSession.value && socket) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target.result
      const messagePayload = {
        sessionId: selectedSession.value,
        sender: 'admin',
        message: base64,
        type: 'image'
      }
      socket.emit('send_message', messagePayload)
      scrollToBottom()
    }
    reader.readAsDataURL(file)
  }
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedSession.value || !socket) return

  const messagePayload = {
    sessionId: selectedSession.value,
    sender: 'admin',
    message: newMessage.value.trim(),
    type: 'text'
  }

  socket.emit('send_message', messagePayload)
  newMessage.value = ''
  showEmojiPicker.value = false
  scrollToBottom()
}

const scrollToBottom = () => {
  setTimeout(() => {
    const chatContainer = document.getElementById('admin-chat-messages')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, 50)
}

onMounted(() => {
  fetchSessions()

  socket = io('http://localhost:3002')
  
  // Admin joins the global admin room to receive new session notifications instantly
  socket.emit('join_admin')

  socket.on('new_session_activity', (data) => {
    // Update the sessions list in real-time
    const existingIndex = sessions.value.findIndex(s => s._id === data.sessionId)
    if (existingIndex > -1) {
      // Update existing
      sessions.value[existingIndex].lastMessage = data.lastMessage
      sessions.value[existingIndex].lastMessageTime = new Date().toISOString()
      // Sort so it pops to the top
      sessions.value.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
    } else {
      // Add new
      sessions.value.unshift({
        _id: data.sessionId,
        lastMessage: data.lastMessage,
        lastMessageTime: new Date().toISOString(),
        customerName: data.customerName || 'Anonymous'
      })
    }
  })

  socket.on('receive_message', (message) => {
    // If we are currently viewing this session, append the message
    if (message.sessionId === selectedSession.value) {
      activeMessages.value.push(message)
      scrollToBottom()
    }
  })
})

onUnmounted(() => {
  if (socket) {
    socket.disconnect()
  }
})
</script>
