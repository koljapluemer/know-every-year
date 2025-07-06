<template>
  <td class="font-mono">
    <RouterLink :to="{ name: 'ManageYear', params: { year } }" class="link link-primary hover:link-primary-focus">
      {{ year }}
    </RouterLink>
  </td>
  <td>
    <div v-if="events.length > 0" class="space-y-2">
      <div 
        v-for="event in events" 
        :key="event.id"
        class="card bg-base-200 shadow-sm p-2"
      >
        <div class="text-sm font-medium">{{ event.content }}</div>
        <div class="text-xs text-gray-600">{{ event.mentalImage }}</div>
      </div>
    </div>
    <span v-else>-</span>
  </td>
  <td>{{ yearData?.notes || '-' }}</td>
  <td>
    <div class="flex flex-row gap-1">
      <div class="text-sm">
        {{ firstNumberAssociation || '?' }}
      </div>
      <div class="text-sm">+</div>
      <div class="text-sm">
        {{ secondNumberAssociation || '?' }}
      </div>
    </div>
  </td>
  <td>
    <div class="flex flex-col gap-1 text-xs">
      <div v-if="yearData?.yearToEventsLearningData">
        <span class="text-gray-600">Year→Events:</span>
        <span class="ml-1">{{ formatDueDate(yearData.yearToEventsLearningData.due) }}</span>
      </div>
      <div v-if="eventsWithLearningData.length > 0">
        <span class="text-gray-600">Events→Year:</span>
        <div class="ml-1">
          <div v-for="event in eventsWithLearningData" :key="event.id" class="text-xs">
            {{ event.content.substring(0, 20) }}...: {{ formatDueDate(event.eventToYearLearningData!.due) }}
          </div>
        </div>
      </div>
      <div v-if="!yearData?.yearToEventsLearningData && eventsWithLearningData.length === 0">
        <span class="text-gray-500">No learning data</span>
      </div>
    </div>
  </td>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useYearAssociationStore } from '../stores/useYearAssociationStore'
import { useNumberAssociationStore } from '../stores/useNumberAssociationStore'
import { useEventsStore } from '../stores/useEventsStore'

interface Props {
  year: string
}

const props = defineProps<Props>()

const yearAssociationStore = useYearAssociationStore()
const numberAssociationStore = useNumberAssociationStore()
const eventsStore = useEventsStore()

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

const eventsWithLearningData = computed(() => {
  return events.value.filter(event => event.eventToYearLearningData)
})

const formatDueDate = (date: Date) => {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `Overdue (${Math.abs(diffDays)} days)`
  } else if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Tomorrow'
  } else if (diffDays <= 7) {
    return `In ${diffDays} days`
  } else {
    return date.toLocaleDateString()
  }
}
</script>
