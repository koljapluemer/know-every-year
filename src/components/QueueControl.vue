<template>
  <RandomNumberExerciseControl @no-exercises-available="handleNoExercisesAvailable" />
</template>

<script setup lang="ts">
import RandomNumberExerciseControl from './RandomNumberExerciseControl.vue'

const handleNoExercisesAvailable = () => {
  console.log('No exercises available for practice')
  // TODO: Handle this case - could show a message, redirect to create associations, etc.
}
</script>
