<template>
  <DigitExerciseBySoundRender
    :sound="sound"
    :digit="digit"
    :notes="notes"
    @rating-selected="handleRatingSelected"
    :key="sound"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import DigitExerciseBySoundRender from './DigitExerciseBySoundRender.vue'

interface Props {
  sound: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'exercise-completed': []
}>()

const digitAssociationStore = useDigitAssociationStore()

const digit = computed(() => {
  const digitValue = digitAssociationStore.getDigitForSound(props.sound)
  return digitValue?.toString() || '?'
})

const notes = computed(() => {
  const digitValue = digitAssociationStore.getDigitForSound(props.sound)
  if (digitValue === null) return undefined
  return digitAssociationStore.associations[digitValue]?.notes
})

const handleRatingSelected = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
  // Update the sound card with the rating
  digitAssociationStore.updateSoundCard(props.sound, rating)
  
  // Pass the event up to load next exercise
  emit('exercise-completed')
}
</script> 