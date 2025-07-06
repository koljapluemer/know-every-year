<template>
  <NumberExerciseControl 
    :number="currentExercise.number" 
    @exercise-completed="loadNextExercise"
    v-if="currentExercise && currentExercise.direction === 'numberToWord'"
  />
  <NumberExerciseByWordControl 
    :number="currentExercise.number" 
    @exercise-completed="loadNextExercise"
    v-else-if="currentExercise && currentExercise.direction === 'wordToNumber'"
  />
  <div v-else class="text-center p-8">
    <h2 class="text-2xl font-bold mb-4">No Exercises Available</h2>
    <p class="text-lg">You need to create some number associations first!</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import NumberExerciseControl from './NumberExerciseControl.vue'
import NumberExerciseByWordControl from './NumberExerciseByWordControl.vue'

const numberAssociationStore = useNumberAssociationStore()
const currentExercise = ref<{ number: string; direction: 'numberToWord' | 'wordToNumber' } | null>(null)

const emit = defineEmits<{
  'no-exercises-available': []
}>()

const loadRandomExercise = () => {
  const exercise = numberAssociationStore.getRandomPracticeExercise()
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
