<template>
  <div
    class="card bg-base-200 shadow-sm"
    :class="{ 'opacity-60': todo.completed }"
  >
    <div class="card-body p-4">
      <!-- Display Mode -->
      <div
        v-if="!isEditing"
        class="flex items-start gap-4"
      >
        <!-- Checkbox -->
        <input
          type="checkbox"
          :checked="todo.completed"
          class="checkbox checkbox-primary mt-1"
          @change="$emit('toggle-completed', todo.id)"
        >

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <h3
            class="font-bold"
            :class="{ 'line-through': todo.completed }"
          >
            {{ todo.title }}
          </h3>
          <p
            v-if="todo.notes"
            class="text-sm text-gray-600 mt-1"
          >
            {{ todo.notes }}
          </p>

          <!-- Metadata -->
          <div class="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
            <span>Created: {{ formatDate(todo.createdAt) }}</span>
            <span v-if="todo.associatedEventIds.length > 0">
              {{ todo.associatedEventIds.length }} event(s) linked
            </span>
            <span v-if="todo.dueAt">
              Due: <WidgetDueDate :due-date="todo.dueAt" />
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 ml-4">
          <button
            class="btn btn-sm btn-outline"
            @click="startEdit"
          >
            Edit
          </button>
          <button
            class="btn btn-sm btn-error"
            @click="confirmDelete"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- Edit Mode -->
      <div
        v-else
        class="space-y-4"
      >
        <div class="form-control">
          <label class="label">
            <span class="label-text">Title</span>
          </label>
          <input
            v-model="editTitle"
            type="text"
            class="input input-bordered w-full"
          >
        </div>
        <div class="form-control">
          <label class="label">
            <span class="label-text">Notes (optional)</span>
          </label>
          <textarea
            v-model="editNotes"
            class="textarea textarea-bordered w-full"
            rows="2"
          />
        </div>
        <div class="flex justify-end gap-2">
          <button
            class="btn btn-sm btn-outline"
            @click="cancelEdit"
          >
            Cancel
          </button>
          <button
            class="btn btn-sm btn-primary"
            :disabled="!editTitle.trim()"
            @click="saveEdit"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Todo } from '@/entities/Todo'
import WidgetDueDate from '@/components/widgets/WidgetDueDate.vue'

interface Props {
  todo: Todo
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'toggle-completed': [todoId: string]
  'update-todo': [todoId: string, updates: { title?: string; notes?: string }]
  'delete-todo': [todoId: string]
}>()

// Edit state
const isEditing = ref(false)
const editTitle = ref('')
const editNotes = ref('')

// Methods
const formatDate = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  })
}

const startEdit = () => {
  editTitle.value = props.todo.title
  editNotes.value = props.todo.notes || ''
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveEdit = () => {
  if (!editTitle.value.trim()) return

  emit('update-todo', props.todo.id, {
    title: editTitle.value.trim(),
    notes: editNotes.value.trim() || undefined
  })
  isEditing.value = false
}

const confirmDelete = () => {
  if (confirm('Are you sure you want to delete this todo?')) {
    emit('delete-todo', props.todo.id)
  }
}
</script>
