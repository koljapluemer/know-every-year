<template>
  <ExerciseYearToEventsRender
    :year="currentYear"
    :events="currentEvents"
    :is-revealed="isRevealed"
    :is-completed="isCompleted"
    @reveal="handleReveal"
    @rate="handleRate"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useYearAssociationStore } from '../stores/useYearAssociationStore'
import { useEventsStore } from '../stores/useEventsStore'
import { useToast } from '../ui/useToast'
import ExerciseYearToEventsRender from './ExerciseYearToEventsRender.vue'

interface Props {
  year: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'completed': []
}>()

const yearAssociationStore = useYearAssociationStore()
const eventsStore = useEventsStore()

// Reactive state
const isRevealed = ref(false)
const isCompleted = ref(false)

// Computed properties
const currentYear = computed(() => props.year)
const currentEvents = computed(() => eventsStore.getEventsForYear(props.year))

// Methods
const handleReveal = () => {
  isRevealed.value = true
}

const handleRate = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
  try {
    // Update the year card with the rating
    yearAssociationStore.updateYearCard(props.year, rating)
    
    // Mark as completed
    isCompleted.value = true
    
    // Emit completion event
    emit('completed')
  } catch (error) {
    console.error('Error updating year card:', error)
  }
}
</script>
