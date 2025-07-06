<template>

  <div class="text-center ">

    <div class="text-center mb-8">
      <div class="text-6xl font-bold font-mono">{{ year }}</div>
    </div>

    <!-- Reveal Button -->
    <TaskButtonRender v-if="!isRevealed" :buttons="[revealButton]" />

    <!-- Events Display -->
    <div v-if="isRevealed" class="space-y-6">
      
      <!-- Events List -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-xl mb-4">Events for {{ year }}</h3>
          <div v-if="events.length > 0" class="space-y-4">
            <FormWidgetEvent v-for="event in events" :key="event.id" :event="event" :readonly="true" />
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
import FormWidgetEvent from '@/components/forms/widgets/FormWidgetEvent.vue'

interface Props {
  year: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'task-done': []
}>()

const yearAssociationStore = useYearAssociationStore()
const eventsStore = useEventsStore()
const { createRevealButton, createRatingButtons } = useTaskButtons()

const isRevealed = ref(false)
const isCompleted = ref(false)

const events = computed(() => eventsStore.getEventsForYear(props.year))

const revealAnswer = () => {
  isRevealed.value = true
}

const selectRating = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
  yearAssociationStore.updateYearCard(props.year, rating)
  isCompleted.value = true
  emit('task-done')
}

const revealButton = computed(() => createRevealButton(revealAnswer, { label: 'Reveal Events' }))
const ratingButtons = computed(() => createRatingButtons(selectRating, { size: 'lg' }))
</script>
