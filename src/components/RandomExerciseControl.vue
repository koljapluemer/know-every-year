<template>
  <!-- Number association exercises -->
  <NumberExerciseControl 
    :number="currentExercise.identifier" 
    @exercise-completed="loadNextExercise"
    v-if="currentExercise && currentExercise.type === 'number' && currentExercise.direction === 'numberToWord'"
  />
  <NumberExerciseByWordControl 
    :number="currentExercise.identifier" 
    @exercise-completed="loadNextExercise"
    v-else-if="currentExercise && currentExercise.type === 'number' && currentExercise.direction === 'wordToNumber'"
  />
  
  <!-- Digit association exercises -->
  <DigitExerciseControl 
    :digit="currentExercise.identifier" 
    @exercise-completed="loadNextExercise"
    v-else-if="currentExercise && currentExercise.type === 'digit' && currentExercise.direction === 'numberToSound'"
  />
  <DigitExerciseBySoundControl 
    :sound="currentExercise.identifier" 
    @exercise-completed="loadNextExercise"
    v-else-if="currentExercise && currentExercise.type === 'digit' && currentExercise.direction === 'soundToNumber'"
  />
  
  <!-- No exercises available -->
  <div v-else class="text-center p-8">
    <h2 class="text-2xl font-bold mb-4">No Exercises Available</h2>
    <p class="text-lg">You need to create some associations first!</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import NumberExerciseControl from './NumberExerciseControl.vue'
import NumberExerciseByWordControl from './NumberExerciseByWordControl.vue'
import DigitExerciseControl from './DigitExerciseControl.vue'
import DigitExerciseBySoundControl from './DigitExerciseBySoundControl.vue'

const numberAssociationStore = useNumberAssociationStore()
const digitAssociationStore = useDigitAssociationStore()

const currentExercise = ref<{ 
  type: 'number' | 'digit'; 
  identifier: string; 
  direction: 'numberToWord' | 'wordToNumber' | 'numberToSound' | 'soundToNumber' 
} | null>(null)

const emit = defineEmits<{
  'no-exercises-available': []
}>()

const loadRandomExercise = () => {
  const exercise = numberAssociationStore.getRandomPracticeExerciseFromAll(digitAssociationStore)
  currentExercise.value = exercise
  
  if (!exercise) {
    emit('no-exercises-available')
  }
}

const loadNextExercise = () => {
  loadRandomExercise()
}

onMounted(() => {
  loadRandomExercise()
})
</script> 