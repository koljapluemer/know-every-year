<template>
  <!-- Number association exercises -->
  <NumberExerciseControl 
    :number="currentExercise!.identifier" 
    @exercise-completed="loadNextExercise"
    v-if="isNumberToWordExercise"
  />
  <NumberExerciseByWordControl 
    :number="currentExercise!.identifier" 
    @exercise-completed="loadNextExercise"
    v-else-if="isWordToNumberExercise"
  />
  
  <!-- Digit association exercises -->
  <DigitExerciseControl 
    :digit="currentExercise!.identifier" 
    @exercise-completed="loadNextExercise"
    v-else-if="isDigitToSoundExercise"
  />
  <DigitExerciseBySoundControl 
    :sound="currentExercise!.identifier" 
    @exercise-completed="loadNextExercise"
    v-else-if="isSoundToDigitExercise"
  />
  
  <!-- Peg creation exercise -->
  <NumberPegFormControl 
    :number="currentExercise!.identifier"
    @saved="loadNextExercise"
    v-else-if="isCreatePegExercise"
  />
  
  <!-- No exercises available -->
  <div v-else class="text-center p-8">
    <h2 class="text-2xl font-bold mb-4">No Exercises Available</h2>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useQueueUtils } from '../composables/useQueueUtils'
import type { QueueTask } from '../entities/QueueTasks'
import NumberExerciseControl from './NumberExerciseControl.vue'
import NumberExerciseByWordControl from './NumberExerciseByWordControl.vue'
import DigitExerciseControl from './DigitExerciseControl.vue'
import DigitExerciseBySoundControl from './DigitExerciseBySoundControl.vue'
import NumberPegFormControl from './NumberPegFormControl.vue'

const { getRandomExercise } = useQueueUtils()

const currentExercise = ref<QueueTask | null>(null)

// Computed properties for type-safe exercise checking
const isNumberToWordExercise = computed(() => 
  currentExercise.value?.type === 'number' && currentExercise.value?.direction === 'numberToWord'
)

const isWordToNumberExercise = computed(() => 
  currentExercise.value?.type === 'number' && currentExercise.value?.direction === 'wordToNumber'
)

const isDigitToSoundExercise = computed(() => 
  currentExercise.value?.type === 'digit' && currentExercise.value?.direction === 'numberToSound'
)

const isSoundToDigitExercise = computed(() => 
  currentExercise.value?.type === 'digit' && currentExercise.value?.direction === 'soundToNumber'
)

const isCreatePegExercise = computed(() => 
  currentExercise.value?.type === 'peg' && currentExercise.value?.direction === 'createPeg'
)

const loadRandomExercise = () => {
  const exercise = getRandomExercise()
  currentExercise.value = exercise
  
  if (!exercise) {
    console.log('No exercises available for practice')
    // TODO: Handle this case - could show a message, redirect to create associations, etc.
  }
}

const loadNextExercise = () => {
  loadRandomExercise()
}

onMounted(() => {
  loadRandomExercise()
})
</script>
