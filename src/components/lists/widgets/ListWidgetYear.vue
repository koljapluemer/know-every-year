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
        class="card bg-base-300 shadow-sm p-2"
      >
        <div class="text-sm font-medium">{{ event.content }}</div>
        <div class="text-xs text-gray-600">{{ event.mentalImage }}</div>
      </div>
    </div>
    <span v-else>-</span>
  </td>
  <td class="hidden md:table-cell">{{ yearData?.notes || '-' }}</td>
  <td class="hidden md:table-cell">
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
  <td class="hidden md:table-cell">
    <div class="flex flex-col gap-1 text-xs">
      <div v-if="yearData?.yearToEventsLearningData">
        <span class="text-gray-600">Year→Events:</span>
        <WidgetDueDate :due-date="yearData.yearToEventsLearningData.due" />
      </div>
      <div v-if="eventsWithLearningData.length > 0">
        <span class="text-gray-600">Events→Year:</span>
        <div class="ml-1">
          <div v-for="event in eventsWithLearningData" :key="event.id" class="text-xs">
            {{ event.content.substring(0, 20) }}...: <WidgetDueDate :due-date="event.eventToYearLearningData!.due" />
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
import { useYearAssociationStore } from '@/stores/useYearAssociationStore'
import { useNumberAssociationStore } from '@/stores/useNumberAssociationStore'
import { useEventsStore } from '@/stores/useEventsStore'
import WidgetDueDate from '@/components/widgets/WidgetDueDate.vue'

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
</script>
