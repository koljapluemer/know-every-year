<template>
  <NumberExerciseRender
    :number="number"
    :association="association"
    @rating-selected="handleRatingSelected"
    :key="number"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import NumberExerciseRender from './NumberExerciseRender.vue'

interface Props {
  number: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'exercise-completed': []
}>()

const numberAssociationStore = useNumberAssociationStore()

const association = computed(() => numberAssociationStore.getAssociation(props.number))

const handleRatingSelected = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
  // Update the card with the rating
  numberAssociationStore.updateCard(props.number, rating)
  
  // Pass the event up to load next exercise
  emit('exercise-completed')
}
</script>
