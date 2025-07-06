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
          <div class="flex items-center gap-4">
            <div class="text-5xl">
              {{ firstNumberAssociation || '?' }}
            </div>
            <span class="text-5xl">+</span>
            <div class="text-5xl">
              {{ secondNumberAssociation || '?' }}
            </div>
          </div>
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

    <!-- Year Notes -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body">
        <h2 class="card-title">Year Notes</h2>
        <textarea 
          v-model="yearNotes" 
          @input="debouncedUpdateYearNotes"
          placeholder="Add general notes about this year..."
          class="textarea textarea-bordered w-full" 
          rows="3"
        ></textarea>
      </div>
    </div>

    <!-- Events List -->
    <div class="card bg-base-100 shadow-lg mb-6">
      <div class="card-body">
        <h2 class="card-title">Events</h2>
        
        <!-- Existing Events -->
        <div v-if="events.length > 0" class="space-y-4 mb-6">
          <div 
            v-for="event in events" 
            :key="event.id"
            class="card bg-base-200 shadow-sm"
          >
            <div class="card-body p-4">
              <!-- Event Display Mode -->
              <div v-if="!editingEvents.has(event.id)" class="space-y-2">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-medium">{{ event.content }}</h3>
                    <p class="text-sm text-gray-600">{{ event.mentalImage }}</p>
                    <p v-if="event.notes" class="text-sm text-gray-500 mt-1">{{ event.notes }}</p>
                  </div>
                  <div class="flex gap-2 ml-4">
                    <button @click="startEditEvent(event.id)" class="btn btn-sm btn-outline">
                      Edit
                    </button>
                    <button @click="confirmDeleteEvent(event.id)" class="btn btn-sm btn-error">
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <!-- Event Edit Mode -->
              <div v-else class="space-y-3">
                <textarea  
                  v-model="editingEventData[event.id].content"
                  @input="debouncedUpdateEvent(event.id)"
                  type="text" 
                  placeholder="Event content"
                  class="textarea textarea-bordered w-full"
                />
                <textarea 
                  v-model="editingEventData[event.id].mentalImage"
                  @input="debouncedUpdateEvent(event.id)"
                  type="text" 
                  placeholder="Mental image"
                  class="textarea textarea-bordered w-full"
                />
                <textarea 
                  v-model="editingEventData[event.id].notes"
                  @input="debouncedUpdateEvent(event.id)"
                  placeholder="Notes (optional)"
                  class="textarea textarea-bordered w-full"
                  rows="2"
                ></textarea>
                <div class="flex justify-end gap-2">
                  <button @click="cancelEditEvent(event.id)" class="btn btn-sm btn-outline">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Add New Event Form -->
        <div class="card bg-base-200 shadow-sm">
          <div class="card-body p-4">
            <h3 class="font-medium mb-3">Add New Event</h3>
            <div class="space-y-3">
              <textarea 
                v-model="newEvent.content"
                type="text" 
                placeholder="Event content"
                class="textarea textarea-bordered w-full"
              />
              <textarea 
                v-model="newEvent.mentalImage"
                type="text" 
                placeholder="Mental image"
                class="textarea textarea-bordered w-full"
              />
              <textarea 
                v-model="newEvent.notes"
                placeholder="Notes (optional)"
                class="textarea textarea-bordered w-full"
                rows="2"
              ></textarea>
              <div class="flex justify-end">
                <button @click="addNewEvent" class="btn btn-primary" :disabled="!canAddEvent">
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Learning Data -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">Learning Data</h2>
        <div class="space-y-4">
          <!-- Year Learning Data -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Year → Events</h3>
              <p class="text-sm text-gray-600">Reset learning progress for recalling events from this year</p>
            </div>
            <button 
              @click="$emit('reset-year-learning')"
              class="btn btn-sm btn-outline btn-error"
              :disabled="!yearData?.yearToEventsLearningData"
            >
              Reset
            </button>
          </div>

          <!-- Event Learning Data -->
          <div v-if="events.length > 0" class="space-y-2">
            <h3 class="font-medium">Events → Year</h3>
            <div v-for="event in events" :key="event.id" class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm">{{ event.content }}</p>
                <p class="text-xs text-gray-600">Reset learning progress for recalling this year from the event</p>
              </div>
              <button 
                @click="$emit('reset-event-learning', event.id)"
                class="btn btn-sm btn-outline btn-error ml-4"
                :disabled="!event.eventToYearLearningData"
              >
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
import type { Year } from '../entities/YearAssociations'
import type { Event } from '../entities/YearAssociations'

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
const editingEvents = ref(new Set<string>())
const editingEventData = reactive<Record<string, { content: string; mentalImage: string; notes: string }>>({})

const newEvent = reactive({
  content: '',
  mentalImage: '',
  notes: ''
})

// Computed
const canAddEvent = computed(() => newEvent.content.trim() && newEvent.mentalImage.trim())

// Debounced functions
const debouncedUpdateYearNotes = (inputEvent: any) => {
  const target = inputEvent.target as HTMLTextAreaElement
  setTimeout(() => {
    emit('update-year-notes', target.value)
  }, 500)
}

const debouncedUpdateEvent = (eventId: string) => {
  const data = editingEventData[eventId]
  if (data) {
    setTimeout(() => {
      emit('update-event', eventId, {
        content: data.content,
        mentalImage: data.mentalImage,
        notes: data.notes || undefined
      })
    }, 500)
  }
}

// Methods
const startEditEvent = (eventId: string) => {
  const event = props.events.find(e => e.id === eventId)
  if (event) {
    editingEventData[eventId] = {
      content: event.content,
      mentalImage: event.mentalImage,
      notes: event.notes || ''
    }
    editingEvents.value.add(eventId)
  }
}

const cancelEditEvent = (eventId: string) => {
  editingEvents.value.delete(eventId)
  delete editingEventData[eventId]
}

const confirmDeleteEvent = (eventId: string) => {
  if (confirm('Are you sure you want to delete this event?')) {
    emit('delete-event', eventId)
  }
}

const addNewEvent = () => {
  if (canAddEvent.value) {
    emit('add-event', {
      content: newEvent.content.trim(),
      mentalImage: newEvent.mentalImage.trim(),
      notes: newEvent.notes.trim() || undefined
    })
    
    // Reset form
    newEvent.content = ''
    newEvent.mentalImage = ''
    newEvent.notes = ''
  }
}

// Initialize year notes
onMounted(() => {
  yearNotes.value = props.yearData?.notes || ''
})
</script> 