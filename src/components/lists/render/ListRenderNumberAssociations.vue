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
            <th class="hidden md:table-cell">Notes</th>
            <th class="hidden md:table-cell w-32">Number→Word Due</th>
            <th class="hidden md:table-cell w-32">Word→Number Due</th>
            <th class="hidden md:table-cell w-16">Status</th>
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
            <td class="hidden md:table-cell">
              <span v-if="item.association?.notes" class="text-sm text-gray-600">
                {{ item.association.notes }}
              </span>
              <span v-else class="text-gray-400 text-sm">
                -
              </span>
            </td>
            <td class="hidden md:table-cell text-sm">
              <span v-if="item.association?.numberToWordLearningData">
                <WidgetDueDate :due-date="item.association.numberToWordLearningData.due" />
              </span>
              <span v-else class="text-gray-400 italic">
                No practice data yet
              </span>
            </td>
            <td class="hidden md:table-cell text-sm">
              <span v-if="item.association?.wordToNumberLearningData">
                <WidgetDueDate :due-date="item.association.wordToNumberLearningData.due" />
              </span>
              <span v-else class="text-gray-400 italic">
                No practice data yet
              </span>
            </td>
            <td class="hidden md:table-cell text-center">
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
import WidgetDueDate from '@/components/widgets/WidgetDueDate.vue'

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

defineProps<Props>()
const router = useRouter()

const navigateToManage = (number: string) => {
  router.push({ name: 'ManagePeg', params: { number } })
}
</script>
