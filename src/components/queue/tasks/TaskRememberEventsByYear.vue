<template>


  <div class="text-center mb-8">
    <div class="text-6xl font-bold font-mono">{{ year }}</div>
  </div>

  <!-- Reveal Button -->
  <TaskButtonRender v-if="!isRevealed" :buttons="[revealButton]" />

  <!-- Events Display -->
  <div v-if="isRevealed" class="flex flex-col gap-8 items-center">
    <WidgetNumberAssociationsForYear :year="year" />

    <!-- Events List -->
    <FormWidgetEvent v-if="events.length > 0" v-for="event in events" :key="event.id" :event="event" :readonly="true" />
    <p v-else class="text-gray-500 text-lg">No events found for this year</p>

    <TaskButtonRender :buttons="ratingButtons" v-if="!isCompleted" />

  </div>

  <!-- Rating Buttons -->

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useYearAssociationStore } from '@/stores/useYearAssociationStore'
import { useEventsStore } from '@/stores/useEventsStore'
import { useTaskButtons } from '@/components/queue/widgets/buttonRow/useTaskButtons'
import TaskButtonRender from '@/components/queue/widgets/buttonRow/TaskButtonRender.vue'
import FormWidgetEvent from '@/components/forms/widgets/FormWidgetEvent.vue'
import WidgetNumberAssociationsForYear from '@/components/widgets/WidgetNumberAssociationsForYear.vue'

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
