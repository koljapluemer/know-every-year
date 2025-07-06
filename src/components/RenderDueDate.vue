<template>
  <span class="font-mono" :class="dueDateClass">
    {{ formattedDueDate }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  dueDate: Date | string | undefined
}

const props = defineProps<Props>()

const formattedDueDate = computed(() => {
  if (!props.dueDate) {
    return 'No learning data yet'
  }
  
  const date = new Date(props.dueDate)
  
  // Always show full date and time with minute precision
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }) + ' ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
})

const dueDateClass = computed(() => {
  if (!props.dueDate) return ''
  
  const date = new Date(props.dueDate)
  const now = new Date()
  
  // If due date is in the past, show as red (overdue)
  if (date <= now) {
    return 'text-error font-semibold'
  }
  
  // Otherwise show as normal (future)
  return 'text-success'
})
</script>
