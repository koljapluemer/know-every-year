<template>
    <div v-if="event" class="text-center mb-8">
      <div class="text-6xl font-bold">{{ event.content }}</div>
    </div>

    <!-- Reveal Button -->
    <TaskButtonRender v-if="!isRevealed && event" :buttons="[revealButton]" />

    <!-- Answer Display -->
    <div v-if="isRevealed && event" class="space-y-6">
      <!-- Year Answer -->
      <div class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-xl mb-4">Year: {{ year }}</h3>
          
          <!-- Mental Image -->
          <div class="mb-4">
            <h4 class="font-medium mb-2">Mental Image:</h4>
            <p class="text-lg">{{ event.mentalImage }}</p>
          </div>

          <!-- Notes -->
          <div v-if="event.notes" class="mb-4">
            <h4 class="font-medium mb-2">Notes:</h4>
            <p class="text-lg">{{ event.notes }}</p>
          </div>

          <!-- Digit Associations -->
          <div>
            <h4 class="font-medium mb-2">Digit Associations:</h4>
            <WidgetNumberAssociationsForYear :year="year" />
          </div>
        </div>
      </div>

      <!-- Rating Buttons -->
      <div v-if="!isCompleted" class="card bg-base-100 shadow-lg">
        <div class="card-body">
          <TaskButtonRender :buttons="ratingButtons" :config="{ gap: 'lg' }" />
        </div>
      </div>



    <!-- Error state -->
    <div v-if="!event" class="text-center p-8">
      <h2 class="text-2xl font-bold mb-4">Event Not Found</h2>
      <p class="text-gray-600">The requested event could not be found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEventsStore } from '@/stores/useEventsStore'
import { useTaskButtons } from '@/components/queue/widgets/buttonRow/useTaskButtons'
import TaskButtonRender from '@/components/queue/widgets/buttonRow/TaskButtonRender.vue'
import WidgetNumberAssociationsForYear from '@/components/widgets/WidgetNumberAssociationsForYear.vue'

interface Props {
  eventId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'task-done': []
}>()

const eventsStore = useEventsStore()
const { createRevealButton, createRatingButtons } = useTaskButtons()

const isRevealed = ref(false)
const isCompleted = ref(false)

const event = computed(() => eventsStore.getEvent(props.eventId))
const year = computed(() => {
  // Find the year for this event
  for (const [yearStr, eventIds] of Object.entries(eventsStore.eventsByYear)) {
    if (eventIds.includes(props.eventId)) {
      return yearStr
    }
  }
  return 'Unknown'
})

const revealAnswer = () => {
  isRevealed.value = true
}

const selectRating = (rating: 'wrong' | 'hard' | 'good' | 'easy') => {
  eventsStore.updateEventCard(props.eventId, rating)
  isCompleted.value = true
  emit('task-done')
}

const revealButton = computed(() => createRevealButton(revealAnswer, { label: 'Reveal Year' }))
const ratingButtons = computed(() => createRatingButtons(selectRating, { size: 'lg' }))
</script>
