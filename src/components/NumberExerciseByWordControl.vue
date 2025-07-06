<template>
  <NumberExerciseByWordRender
    :number="number"
    :association="association"
    @rating-selected="handleRatingSelected"
    :key="number"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import NumberExerciseByWordRender from './NumberExerciseByWordRender.vue'

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
  // Update the word card with the rating
  numberAssociationStore.updateWordCard(props.number, rating)
  
  // Pass the event up to load next exercise
  emit('exercise-completed')
}
</script>
