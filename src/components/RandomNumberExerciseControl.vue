<template>
  <NumberExerciseControl 
    :number="currentNumber" 
    @exercise-completed="loadNextExercise"
    v-if="currentNumber"
  />
  <div v-else class="text-center p-8">
    <h2 class="text-2xl font-bold mb-4">No Associations Found</h2>
    <p class="text-lg">You need to create some number associations first!</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import NumberExerciseControl from './NumberExerciseControl.vue'

const numberAssociationStore = useNumberAssociationStore()
const currentNumber = ref<string | null>(null)

const loadRandomExercise = () => {
  const associatedNumbers = numberAssociationStore.associatedNumbers
  if (associatedNumbers.length === 0) {
    currentNumber.value = null
    return
  }
  
  const randomIndex = Math.floor(Math.random() * associatedNumbers.length)
  currentNumber.value = associatedNumbers[randomIndex]
}

const loadNextExercise = () => {
  loadRandomExercise()
}

onMounted(() => {
  loadRandomExercise()
})
</script>
