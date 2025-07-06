<template>
  <div class="max-w-4xl mx-auto">
    <!-- Exercise Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2">Year to Events</h1>
      <p class="text-lg text-gray-600">Recall the events for this year</p>
    </div>

    <!-- Year Display -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body text-center">
        <h2 class="text-6xl font-bold font-mono">{{ year }}</h2>
        <p class="text-lg text-gray-600 mt-2">What events happened in this year?</p>
      </div>
    </div>

    <!-- Reveal Button -->
    <div v-if="!isRevealed" class="text-center mb-6">
      <TaskButtonRender :buttons="[revealButton]" />
    </div>

    <!-- Events Display -->
    <div v-if="isRevealed" class="space-y-6">
      <!-- Events List -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-xl mb-4">Events for {{ year }}</h3>
          
          <div v-if="events.length > 0" class="space-y-4">
            <EventFormRender
              v-for="event in events"
              :key="event.id"
              :event="event"
              :readonly="true"
            />
          </div>
          
          <div v-else class="text-center py-8">
            <p class="text-gray-500 text-lg">No events found for this year</p>
          </div>
        </div>
      </div>

      <!-- Rating Buttons -->
      <div v-if="!isCompleted" class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <TaskButtonRender :buttons="ratingButtons" :config="{ gap: 'lg' }" />
        </div>
      </div>

      <!-- Completion Message -->
      <div v-if="isCompleted" class="card bg-success text-success-content shadow-lg">
        <div class="card-body text-center">
          <h3 class="card-title text-xl">Exercise Completed!</h3>
          <p>Your rating has been recorded. The next review will be scheduled based on your performance.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useYearAssociationStore } from '@/stores/useYearAssociationStore'
import { useEventsStore } from '@/stores/useEventsStore'
import { useTaskButtons } from '@/components/queue/widgets/buttonRow/useTaskButtons'
import TaskButtonRender from '@/components/queue/widgets/buttonRow/TaskButtonRender.vue'
import type { Event } from '@/entities/YearAssociations'
import EventFormRender from '@/components/forms/widgets/FormWidgetEvent.vue'

interface Props {
  year: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'exercise-completed': []
}>()

const yearAssociationStore = useYearAssociationStore()
const eventsStore = useEventsStore()
const { createRevealButton, createRatingButtons } = useTaskButtons()

// Reactive state
const isRevealed = ref(false)
const isCompleted = ref(false)

// Computed properties
const events = computed(() => eventsStore.getEventsForYear(props.year))

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
    emit('exercise-completed')
  } catch (error) {
    console.error('Error updating year card:', error)
  }
}

// Button configurations
const revealButton = computed(() => 
  createRevealButton(handleReveal, { label: 'Reveal Events' })
)

const ratingButtons = computed(() => 
  createRatingButtons(handleRate, { size: 'lg' })
)
</script>
