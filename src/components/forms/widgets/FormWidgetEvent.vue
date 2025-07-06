<template>
  <div class="card bg-base-200 shadow-sm">
    <div class="card-body p-4">
      <!-- Event Display Mode (only for existing events) -->
      <div v-if="!isEditing && event" class="space-y-2">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-bold">{{ event.content }}</h3>
            <p class="">{{ event.mentalImage }}</p>
            <p v-if="event.notes" class="text-sm mt-1">{{ event.notes }}</p>
          </div>
          <div v-if="!readonly" class="flex gap-2 ml-4">
            <button @click="startEdit" class="btn btn-sm btn-outline">
              Edit
            </button>
            <button @click="confirmDelete" class="btn btn-sm btn-error">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Event Form Mode (for editing or adding) -->
      <div v-else-if="!readonly" class="space-y-3">
        <div v-if="!event" class="mb-3">
          <h3 class="font-medium">Add New Event</h3>
        </div>
        
        <textarea  
          v-model="formData.content"
          placeholder="Event content"
          class="textarea textarea-bordered w-full"
        />
        <textarea 
          v-model="formData.mentalImage"
          placeholder="Mental image"
          class="textarea textarea-bordered w-full"
        />
        <textarea 
          v-model="formData.notes"
          placeholder="Notes (optional)"
          class="textarea textarea-bordered w-full"
          rows="2"
        ></textarea>
        <div class="flex justify-end gap-2">
          <button @click="cancel" class="btn btn-sm btn-outline">
            {{ event ? 'Cancel' : 'Clear' }}
          </button>
          <button @click="save" class="btn btn-sm btn-primary" :disabled="!canSave">
            {{ event ? 'Save' : 'Add Event' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { Event } from '../../../entities/YearAssociations'

interface Props {
  event?: Event // Optional for new events
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

const emit = defineEmits<{
  'update': [eventId: string, updates: { content: string; mentalImage: string; notes?: string }]
  'add': [eventData: { content: string; mentalImage: string; notes?: string }]
  'delete': [eventId: string]
}>()

// Reactive state
const isEditing = ref(false)
const formData = reactive({
  content: '',
  mentalImage: '',
  notes: ''
})

// Computed
const canSave = computed(() => 
  formData.content.trim() && 
  formData.mentalImage.trim() &&
  (props.event ? 
    // For editing: check if there are actual changes
    (formData.content !== props.event.content ||
     formData.mentalImage !== props.event.mentalImage ||
     formData.notes !== (props.event.notes || '')) :
    // For new: just check if required fields are filled
    true
  )
)

// Methods
const startEdit = () => {
  if (props.event) {
    formData.content = props.event.content
    formData.mentalImage = props.event.mentalImage
    formData.notes = props.event.notes || ''
    isEditing.value = true
  }
}

const cancel = () => {
  if (props.event) {
    // Cancel editing - return to display mode
    isEditing.value = false
  } else {
    // Clear form for new event
    formData.content = ''
    formData.mentalImage = ''
    formData.notes = ''
  }
}

const save = () => {
  if (canSave.value) {
    if (props.event) {
      // Update existing event
      emit('update', props.event.id, {
        content: formData.content.trim(),
        mentalImage: formData.mentalImage.trim(),
        notes: formData.notes.trim() || undefined
      })
      isEditing.value = false
    } else {
      // Add new event
      emit('add', {
        content: formData.content.trim(),
        mentalImage: formData.mentalImage.trim(),
        notes: formData.notes.trim() || undefined
      })
      // Clear form after adding
      formData.content = ''
      formData.mentalImage = ''
      formData.notes = ''
    }
  }
}

const confirmDelete = () => {
  if (props.event && confirm('Are you sure you want to delete this event?')) {
    emit('delete', props.event.id)
  }
}
</script>
