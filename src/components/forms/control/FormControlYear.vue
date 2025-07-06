<template>
  <FormRenderYear
    :year="year"
    :yearData="yearData"
    :events="events"
    :firstDigitStr="firstDigitStr"
    :secondDigitStr="secondDigitStr"
    :firstNumberAssociation="firstNumberAssociation"
    :secondNumberAssociation="secondNumberAssociation"
    :hasFirstPeg="hasFirstPeg"
    :hasSecondPeg="hasSecondPeg"
    @update-year-notes="handleUpdateYearNotes"
    @add-event="handleAddEvent"
    @update-event="handleUpdateEvent"
    @delete-event="handleDeleteEvent"
    @reset-year-learning="handleResetYearLearning"
    @reset-event-learning="handleResetEventLearning"
  />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useYearAssociationStore } from '@/stores/useYearAssociationStore'
import { useEventsStore } from '@/stores/useEventsStore'
import { useNumberAssociationStore } from '@/stores/useNumberAssociationStore'
import { useToast } from '@/ui/useToast'
import FormRenderYear from '@/components/forms/render/FormRenderYear.vue'

interface Props {
  year: string
}

const props = defineProps<Props>()

const yearAssociationStore = useYearAssociationStore()
const eventsStore = useEventsStore()
const numberAssociationStore = useNumberAssociationStore()
const { success, error } = useToast()

// Computed properties
const yearData = computed(() => yearAssociationStore.getYear(props.year))
const events = computed(() => eventsStore.getEventsForYear(props.year))

const firstDigitStr = computed(() => {
  const yearNum = parseInt(props.year === '0000' ? '0' : props.year)
  return Math.floor(yearNum / 100).toString().padStart(2, '0')
})

const secondDigitStr = computed(() => {
  const yearNum = parseInt(props.year === '0000' ? '0' : props.year)
  return (yearNum % 100).toString().padStart(2, '0')
})

const firstNumberAssociation = computed(() => {
  const numberAssoc = numberAssociationStore.getAssociation(firstDigitStr.value)
  return numberAssoc?.word || null
})

const secondNumberAssociation = computed(() => {
  const numberAssoc = numberAssociationStore.getAssociation(secondDigitStr.value)
  return numberAssoc?.word || null
})

const hasFirstPeg = computed(() => numberAssociationStore.hasAssociation(firstDigitStr.value))
const hasSecondPeg = computed(() => numberAssociationStore.hasAssociation(secondDigitStr.value))

// Event handlers
const handleUpdateYearNotes = (notes: string) => {
  try {
    yearAssociationStore.setYear(props.year, { notes })
    success('Year notes updated successfully!')
  } catch (err) {
    error('Failed to update year notes')
  }
}

const handleAddEvent = (eventData: { content: string; mentalImage: string; notes?: string }) => {
  try {
    const eventId = eventsStore.addEvent(props.year, eventData)
    success('Event added successfully!')
    return eventId
  } catch (err) {
    error('Failed to add event')
  }
}

const handleUpdateEvent = (eventId: string, updates: { content: string; mentalImage: string; notes?: string }) => {
  try {
    eventsStore.updateEvent(eventId, updates)
    success('Event updated successfully!')
  } catch (err) {
    error('Failed to update event')
  }
}

const handleDeleteEvent = (eventId: string) => {
  try {
    eventsStore.removeEvent(eventId)
    success('Event deleted successfully!')
  } catch (err) {
    error('Failed to delete event')
  }
}

const handleResetYearLearning = () => {
  try {
    const yearData = yearAssociationStore.getYear(props.year)
    if (yearData?.yearToEventsLearningData) {
      yearData.yearToEventsLearningData = undefined
      success('Year learning data reset successfully!')
    }
  } catch (err) {
    error('Failed to reset year learning data')
  }
}

const handleResetEventLearning = (eventId: string) => {
  try {
    const event = eventsStore.getEvent(eventId)
    if (event?.eventToYearLearningData) {
      event.eventToYearLearningData = undefined
      success('Event learning data reset successfully!')
    }
  } catch (err) {
    error('Failed to reset event learning data')
  }
}
</script> 