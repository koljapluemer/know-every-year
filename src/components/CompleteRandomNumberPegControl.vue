<template>
  <div>
    <div class="text-center p-4 m-4 card bg-base-100 shadow-lg">
      <h1 class="text-4xl font-bold mb-4">Complete Your Number Associations</h1>
      <p class="text-lg text-gray-600">
        Fill in your personal associations for numbers 00-99 using the Major System
      </p>
      
      <!-- Progress indicator -->
      <div class="mt-6">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium">Progress</span>
          <span class="text-sm text-gray-600">{{ progress }} / {{ total }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-primary h-2 rounded-full transition-all duration-300" 
            :style="{ width: `${(progress / total) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <NumberPegFormControl
      :number="currentNumber" 
      @saved="handleSaved"
      v-if="currentNumber"
    />
    <div v-else class="text-center p-8">
      <h2 class="text-2xl font-bold mb-4">🎉 Congratulations!</h2>
      <p class="text-lg">You've completed all 100 number associations!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import NumberPegFormControl from './NumberPegFormControl.vue'

const numberAssociationStore = useNumberAssociationStore()
const currentNumber = ref<string | null>(null)

const progress = computed(() => numberAssociationStore.progressCount)
const total = computed(() => numberAssociationStore.totalCount)

const loadRandomNumber = () => {
  currentNumber.value = numberAssociationStore.randomUnassociatedNumber
}

const handleSaved = () => {
  loadRandomNumber()
}

onMounted(() => {
  loadRandomNumber()
})
</script>
