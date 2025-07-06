<template>
  <div class="max-w-6xl mx-auto">
    <!-- Progress summary -->
    <div class="mb-6 p-4 bg-base-100 rounded-lg shadow">
      <div class="flex justify-between items-center">
        <span class="text-lg font-medium">Progress: {{ progress }} / {{ total }}</span>
        <div class="w-64 bg-gray-200 rounded-full h-2">
          <div 
            class="bg-primary h-2 rounded-full transition-all duration-300" 
            :style="{ width: `${(progress / total) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th class="w-20">Number</th>
            <th>Association</th>
            <th>Notes</th>
            <th class="w-32">Number→Word Due</th>
            <th class="w-32">Word→Number Due</th>
            <th class="w-16">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="item in associations" 
            :key="item.number"
            class="cursor-pointer hover:bg-base-200 transition-colors"
            @click="navigateToManage(item.number)"
          >
            <td class="font-mono text-lg font-bold">{{ item.number }}</td>
            <td>
              <span v-if="item.association" class="font-medium">
                {{ item.association.word }}
              </span>
              <span v-else class="text-gray-400 italic">
                No association yet
              </span>
            </td>
            <td>
              <span v-if="item.association?.notes" class="text-sm text-gray-600">
                {{ item.association.notes }}
              </span>
              <span v-else class="text-gray-400 text-sm">
                -
              </span>
            </td>
            <td class="text-sm">
              <span v-if="item.association?.numberToWordLearningData" class="font-mono" :class="getDueDateClass(item.association.numberToWordLearningData.due)">
                {{ formatDueDate(item.association.numberToWordLearningData.due) }}
              </span>
              <span v-else class="text-gray-400 italic">
                No practice data yet
              </span>
            </td>
            <td class="text-sm">
              <span v-if="item.association?.wordToNumberLearningData" class="font-mono" :class="getDueDateClass(item.association.wordToNumberLearningData.due)">
                {{ formatDueDate(item.association.wordToNumberLearningData.due) }}
              </span>
              <span v-else class="text-gray-400 italic">
                No practice data yet
              </span>
            </td>
            <td class="text-center">
              <div v-if="item.association" class="flex justify-center">
                <CheckCircle class="w-5 h-5 text-success" />
              </div>
              <div v-else class="flex justify-center">
                <Circle class="w-5 h-5 text-gray-400" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, Circle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface Props {
  associations: Array<{
    number: string
    association?: { 
      word: string; 
      notes?: string;
      numberToWordLearningData?: any;
      wordToNumberLearningData?: any;
    }
  }>
  progress: number
  total: number
}

const props = defineProps<Props>()
const router = useRouter()

const navigateToManage = (number: string) => {
  router.push({ name: 'ManagePeg', params: { number } })
}

const formatDueDate = (dueDate: Date | string) => {
  if (!dueDate) return 'No practice data yet'
  
  const date = new Date(dueDate)
  
  // Format as "MMM DD, YYYY HH:MM" (e.g., "Jul 06, 2025 14:30")
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }) + ' ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const getDueDateClass = (dueDate: Date | string) => {
  if (!dueDate) return ''
  
  const date = new Date(dueDate)
  const now = new Date()
  
  // If due date is in the past, show as red (overdue)
  if (date <= now) {
    return 'text-error font-semibold'
  }
  
  // If due today, show as orange (urgent)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueToday = new Date(date)
  dueToday.setHours(0, 0, 0, 0)
  
  if (dueToday.getTime() === today.getTime()) {
    return 'text-warning font-semibold'
  }
  
  // Otherwise show as normal (future)
  return 'text-success'
}
</script>
