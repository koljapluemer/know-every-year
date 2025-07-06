<template>
  <RandomExerciseControl @no-exercises-available="handleNoExercisesAvailable" />
</template>

<script setup lang="ts">
import RandomExerciseControl from './RandomExerciseControl.vue'

const handleNoExercisesAvailable = () => {
  console.log('No exercises available for practice')
  // TODO: Handle this case - could show a message, redirect to create associations, etc.
}
</script>
