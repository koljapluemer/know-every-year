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

const handleRatingSelected = (rating: string) => {
  // For now, just pass the event up
  emit('exercise-completed')
}
</script>
