<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-4xl font-bold">Year {{ year }}</h1>
        <RouterLink :to="{ name: 'YearAssociations' }" class="btn btn-outline">
          ← Back to Years
        </RouterLink>
      </div>

      <!-- Digit Associations Display -->
      <div class="card bg-base-100 shadow-lg mb-4">
        <div class="card-body">
          <h2 class="card-title">Digit Associations</h2>
          <WidgetNumberAssociationsForYear :year="year" />
        </div>
      </div>

      <!-- Missing Pegs Warning -->
      <div v-if="!hasFirstPeg || !hasSecondPeg" class="alert alert-warning mb-4">
        <div class="w-6 h-6">⚠️</div>
        <div>
          <h3 class="font-bold">Missing Digit Associations</h3>
          <div class="text-sm">
            <span v-if="!hasFirstPeg">
              Missing association for {{ firstDigitStr }}.
              <RouterLink :to="{ name: 'ManagePeg', params: { number: firstDigitStr } }" class="link link-primary">
                Create it here
              </RouterLink>
            </span>
            <span v-if="!hasFirstPeg && !hasSecondPeg"> and </span>
            <span v-if="!hasSecondPeg">
              Missing association for {{ secondDigitStr }}.
              <RouterLink :to="{ name: 'ManagePeg', params: { number: secondDigitStr } }" class="link link-primary">
                Create it here
              </RouterLink>
            </span>
          </div>
        </div>
      </div>
    </div>



    <!-- Events List -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body">
        <h2 class="card-title">Events</h2>

        <!-- Existing Events -->
        <div v-if="events.length > 0" class="space-y-4 mb-6">
          <EventFormRender v-for="event in events" :key="event.id" :event="event" @update="handleUpdateEvent"
            @delete="handleDeleteEvent" />
        </div>

        <!-- Add New Event Form -->
        <EventFormRender @add="handleAddEvent" />
      </div>
    </div>

    <!-- Year Notes -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body">
        <h2 class="card-title">Year Notes</h2>
        <textarea v-model="yearNotes" @input="debouncedUpdateYearNotes"
          placeholder="Add general notes about this year..." class="textarea textarea-bordered w-full"
          rows="3"></textarea>
      </div>
    </div>

    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Manage Learning Data</h2>
        <div class="space-y-4">
          <!-- Year Practice Due At -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Year → Events</h3>
              <p class="text-sm text-gray-600">Reset learning progress for recalling events from this year</p>
            </div>
            <button @click="$emit('reset-year-learning')" class="btn btn-sm btn-outline btn-error"
              :disabled="!yearData?.yearToEventsLearningData">
              Reset
            </button>
          </div>

          <div v-if="events.length > 0" class="space-y-2">
            <h3 class="font-medium">Events → Year</h3>
            <div v-for="event in events" :key="event.id" class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm">{{ event.content }}</p>
                <p class="text-xs text-gray-600">Reset learning progress for recalling this year from the event</p>
              </div>
              <button @click="$emit('reset-event-learning', event.id)" class="btn btn-sm btn-outline btn-error ml-4"
                :disabled="!event.eventToYearLearningData">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { Year } from '@/entities/YearAssociations'
import type { Event } from '@/entities/YearAssociations'
import EventFormRender from '@/components/forms/widgets/FormWidgetEvent.vue'
import WidgetNumberAssociationsForYear from '@/components/widgets/WidgetNumberAssociationsForYear.vue'

interface Props {
  year: string
  yearData: Year | undefined
  events: Event[]
  firstDigitStr: string
  secondDigitStr: string
  firstNumberAssociation: string | null
  secondNumberAssociation: string | null
  hasFirstPeg: boolean
  hasSecondPeg: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-year-notes': [notes: string]
  'add-event': [eventData: { content: string; mentalImage: string; notes?: string }]
  'update-event': [eventId: string, updates: { content: string; mentalImage: string; notes?: string }]
  'delete-event': [eventId: string]
  'reset-year-learning': []
  'reset-event-learning': [eventId: string]
}>()

// Reactive state
const yearNotes = ref(props.yearData?.notes || '')

// Methods
const handleUpdateEvent = (eventId: string, updates: { content: string; mentalImage: string; notes?: string }) => {
  emit('update-event', eventId, updates)
}

const handleDeleteEvent = (eventId: string) => {
  emit('delete-event', eventId)
}

const handleAddEvent = (eventData: { content: string; mentalImage: string; notes?: string }) => {
  emit('add-event', eventData)
}

// Debounced functions
const debouncedUpdateYearNotes = (inputEvent: any) => {
  const target = inputEvent.target as HTMLTextAreaElement
  setTimeout(() => {
    emit('update-year-notes', target.value)
  }, 500)
}

// Initialize year notes
onMounted(() => {
  yearNotes.value = props.yearData?.notes || ''
})
</script>