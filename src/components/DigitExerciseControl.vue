<template>
  <DigitExerciseRender
    :digit="digit"
    :sounds="sounds"
    :notes="notes"
    @rating-selected="handleRatingSelected"
    :key="digit"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDigitAssociationStore } from '../stores/useDigitAssociationStore'
import DigitExerciseRender from './DigitExerciseRender.vue'

interface Props {
  digit: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'exercise-completed': []
}>()

const digitAssociationStore = useDigitAssociationStore()

const association = computed(() => digitAssociationStore.associations[parseInt(props.digit)])

const sounds = computed(() => association.value?.sounds || [])
const notes = computed(() => association.value?.notes)

const handleRatingSelected = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
  // Update the digit card with the rating
  digitAssociationStore.updateDigitCard(parseInt(props.digit), rating)
  
  // Pass the event up to load next exercise
  emit('exercise-completed')
}
</script> 