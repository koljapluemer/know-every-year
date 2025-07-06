<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup 
      name="toast" 
      tag="div" 
      class="space-y-2"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="toastTypeClasses[toast.type]"
      >
        <div class="flex items-center justify-between p-4 rounded-lg shadow-lg min-w-64">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5 text-green-500" />
              <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-500" />
              <Info v-else-if="toast.type === 'info'" class="w-5 h-5 text-blue-500" />
              <AlertTriangle v-else-if="toast.type === 'warning'" class="w-5 h-5 text-yellow-500" />
            </div>
            <span class="text-sm font-medium">{{ toast.message }}</span>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-vue-next'
import { useToast } from './useToast'

const { toasts, removeToast } = useToast()

const toastTypeClasses = {
  success: 'bg-green-50 border border-green-200 text-green-800',
  error: 'bg-red-50 border border-red-200 text-red-800',
  info: 'bg-blue-50 border border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
