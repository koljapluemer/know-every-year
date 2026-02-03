<template>
  <div class="text-center flex flex-col gap-6 items-center max-w-2xl mx-auto">
    <!-- Todo Title -->
    <div class="w-full">
      <h2 class="text-3xl font-bold text-primary mb-2">
        {{ todo?.title }}
      </h2>
      <p
        v-if="todo?.notes"
        class="text-gray-600"
      >
        {{ todo.notes }}
      </p>
    </div>

    <!-- Linked Events (editable) -->
    <div
      v-if="linkedEventsWithYear.length > 0"
      class="w-full"
    >
      <h3 class="text-lg font-semibold mb-4">
        Linked events ({{ linkedEventsWithYear.length }})
      </h3>
      <div class="space-y-4">
        <div
          v-for="{ event, year } in linkedEventsWithYear"
          :key="event.id"
          class="w-full"
        >
          <div class="text-xl font-bold mb-2">
            {{ year }}
          </div>
          <WidgetNumberAssociationsForYear
            :year="year"
            class="mb-2"
          />
          <FormWidgetEvent
            :event="event"
            @update="handleUpdateEvent"
            @delete="handleDeleteEvent"
          />
        </div>
      </div>
    </div>

    <!-- Year Input -->
    <div class="w-full">
      <div class="form-control">
        <label class="label">
          <span class="label-text font-semibold">Enter a year to add an event</span>
        </label>
        <input
          v-model="yearInput"
          type="text"
          placeholder="e.g., 1871"
          class="input input-bordered input-lg w-full text-center text-2xl"
          @keyup.enter="handleYearSubmit"
        >
      </div>
    </div>

    <!-- Event Form (shown when year is entered) -->
    <div
      v-if="currentYear"
      class="w-full"
    >
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h3 class="card-title">
            Add event for year {{ currentYear }}
          </h3>

          <WidgetNumberAssociationsForYear
            :year="currentYear"
            class="my-4"
          />

          <div class="space-y-4">
            <textarea
              v-model="eventContent"
              placeholder="Event content"
              class="textarea textarea-bordered w-full textarea-lg"
            />
            <textarea
              v-model="eventMentalImage"
              placeholder="Mental image"
              class="textarea textarea-bordered w-full textarea-lg"
            />
            <textarea
              v-model="eventNotes"
              placeholder="Notes (optional)"
              class="textarea textarea-bordered w-full"
              rows="2"
            />
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              class="btn btn-outline"
              @click="cancelEventForm"
            >
              Cancel
            </button>
            <button
              class="btn btn-primary"
              :disabled="!canAddEvent"
              @click="handleAddEvent"
            >
              Add Event
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <TaskButtonRender :buttons="actionButtons" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodosStore } from '@/stores/useTodosStore'
import { useEventsStore } from '@/stores/useEventsStore'
import { useToast } from '@/ui/useToast'
import { useTaskButtons } from '@/components/queue/widgets/buttonRow/useTaskButtons'
import TaskButtonRender from '@/components/queue/widgets/buttonRow/TaskButtonRender.vue'
import WidgetNumberAssociationsForYear from '@/components/widgets/WidgetNumberAssociationsForYear.vue'
import FormWidgetEvent from '@/components/forms/widgets/FormWidgetEvent.vue'
import type { Event } from '@/entities/YearAssociations'

interface Props {
  todoId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'task-done': []
}>()

const todosStore = useTodosStore()
const eventsStore = useEventsStore()
const { success, error } = useToast()
const { createActionButtons } = useTaskButtons()

// Reactive state
const yearInput = ref('')
const currentYear = ref<string | null>(null)
const eventContent = ref('')
const eventMentalImage = ref('')
const eventNotes = ref('')

// Computed
const todo = computed(() => todosStore.getTodo(props.todoId))

const linkedEventsWithYear = computed((): { event: Event; year: string }[] => {
  if (!todo.value) return []
  return todo.value.associatedEventIds
    .map(id => {
      const event = eventsStore.getEvent(id)
      if (!event) return null
      const year = getEventYear(id)
      return { event, year }
    })
    .filter((e): e is { event: Event; year: string } => e !== null)
})

const canAddEvent = computed(() =>
  eventContent.value.trim() && eventMentalImage.value.trim()
)

// Methods
const getEventYear = (eventId: string): string => {
  for (const [year, eventIds] of Object.entries(eventsStore.eventsByYear)) {
    if (eventIds.includes(eventId)) {
      return year
    }
  }
  return 'Unknown'
}

const handleYearSubmit = () => {
  const year = yearInput.value.trim()
  if (!year) return

  // Validate year format (allow 1-4 digits)
  if (!/^\d{1,4}$/.test(year)) {
    error('Please enter a valid year (1-4 digits)')
    return
  }

  // Pad to 4 digits
  currentYear.value = year.padStart(4, '0')
  yearInput.value = ''
}

const cancelEventForm = () => {
  currentYear.value = null
  eventContent.value = ''
  eventMentalImage.value = ''
  eventNotes.value = ''
}

const handleAddEvent = () => {
  if (!canAddEvent.value || !currentYear.value) return

  try {
    // Add event to events store
    const eventId = eventsStore.addEvent(currentYear.value, {
      content: eventContent.value.trim(),
      mentalImage: eventMentalImage.value.trim(),
      notes: eventNotes.value.trim() || undefined
    } as Omit<Event, 'id'>)

    // Link event to todo
    todosStore.linkEventToTodo(props.todoId, eventId)

    success(`Event added for year ${currentYear.value}!`)

    // Reset form fields but keep the year
    eventContent.value = ''
    eventMentalImage.value = ''
    eventNotes.value = ''
  } catch (e) {
    error(`Failed to add event: ${e instanceof Error ? e.message : String(e)}`)
  }
}

const handleUpdateEvent = (eventId: string, updates: { content: string; mentalImage: string; notes?: string }) => {
  try {
    eventsStore.updateEvent(eventId, updates)
    success('Event updated!')
  } catch (e) {
    error(`Failed to update event: ${e instanceof Error ? e.message : String(e)}`)
  }
}

const handleDeleteEvent = (eventId: string) => {
  try {
    // Unlink from todo first
    todosStore.unlinkEventFromTodo(props.todoId, eventId)
    // Then delete the event
    eventsStore.removeEvent(eventId)
    success('Event deleted!')
  } catch (e) {
    error(`Failed to delete event: ${e instanceof Error ? e.message : String(e)}`)
  }
}

const handleSkip = () => {
  // Reschedule to tomorrow 4am
  todosStore.rescheduleTodo(props.todoId)
  emit('task-done')
}

const handleDone = () => {
  // Reschedule to tomorrow 4am
  todosStore.rescheduleTodo(props.todoId)
  emit('task-done')
}

const handleMarkCompleted = () => {
  // Mark todo as completed
  todosStore.markCompleted(props.todoId)
  success('Todo marked as completed!')
  emit('task-done')
}

const handleDeleteTodo = () => {
  if (confirm('Are you sure you want to delete this todo?')) {
    todosStore.removeTodo(props.todoId)
    success('Todo deleted!')
    emit('task-done')
  }
}

const actionButtons = computed(() =>
  createActionButtons([
    {
      id: 'skip',
      label: 'Skip',
      variant: 'outline',
      size: 'lg',
      onClick: handleSkip
    },
    {
      id: 'done',
      label: 'Done',
      variant: 'primary',
      size: 'lg',
      onClick: handleDone
    },
    {
      id: 'mark-completed',
      label: 'Mark Todo Complete',
      variant: 'success',
      size: 'lg',
      onClick: handleMarkCompleted
    },
    {
      id: 'delete',
      label: 'Delete Todo',
      variant: 'error',
      size: 'lg',
      onClick: handleDeleteTodo
    }
  ])
)
</script>
